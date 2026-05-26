import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { z } from 'zod';

const schema = z.object({
    name:    z.string().min(1, 'Введите имя'),
    phone:   z.string().min(1, 'Введите телефон'),
    email:   z.string().refine(
        (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        'Некорректный email'
    ),
    message: z.string(),
    consent: z.boolean().refine((v) => v === true, 'Необходимо согласие'),
});

async function getSheetsClient() {
    const auth = new GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return google.sheets({ version: 'v4', auth });
}

export async function POST(request: NextRequest) {
    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Некорректный JSON' }, { status: 400 });
    }

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
        const fieldErrors = Object.fromEntries(
            parsed.error.issues.map((i) => [i.path[0], i.message])
        );
        return NextResponse.json(
            { error: 'Ошибка валидации', fieldErrors },
            { status: 400 }
        );
    }

    const { name, phone, email, message } = parsed.data;

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName     = process.env.GOOGLE_SHEET_NAME ?? 'Sheet1';

    if (!spreadsheetId) {
        console.error('GOOGLE_SHEETS_SPREADSHEET_ID не задан');
        return NextResponse.json(
            { error: 'Сервер не настроен' },
            { status: 500 }
        );
    }

    try {
        const sheets = await getSheetsClient();

        const timestamp = new Date().toLocaleString('ru-RU', {
            timeZone: 'Europe/Moscow',
            year:   'numeric',
            month:  '2-digit',
            day:    '2-digit',
            hour:   '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A:F`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[timestamp, name, phone, email, message]],
            },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error('Google Sheets error:', err);
        return NextResponse.json(
            { error: 'Ошибка при отправке. Попробуйте позже.' },
            { status: 500 }
        );
    }
}
