import { Resend } from 'resend';

type Status = 'pending' | 'approved' | 'rejected' | 'cancelled';

type Payload = {
  id: string;
  status: Status;
  title?: string;
  start_time?: string;
  end_time?: string;
  user_id: string;
  room_id: string;
  email?: string;
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '');
const FROM = Deno.env.get('FROM_EMAIL') ?? '';
const SECRET = Deno.env.get('WEBHOOK_SECRET') ?? '';

function subject(s: Status) {
  switch (s) {
    case 'pending': return 'Reservation Submitted';
    case 'approved': return 'Reservation Approved';
    case 'rejected': return 'Reservation Rejected';
    case 'cancelled': return 'Reservation Cancelled';
    default: return 'Reservation Update';
  }
}

function body(p: Payload) {
  return [
    `Status: ${p.status}`,
    `Title: ${p.title ?? 'Reservation'}`,
    `Room: ${p.room_id}`,
    `Start: ${p.start_time}`,
    `End: ${p.end_time}`,
    `Reservation ID: ${p.id}`,
  ].join('\n');
}

Deno.serve(async (req) => {
  const token = (req.headers.get('authorization') ?? '').replace('Bearer ', '').trim();
  if (!SECRET || token !== SECRET) return new Response('Unauthorized', { status: 401 });

  try {
    const payload = (await req.json()) as Payload;
    if (!payload.email) return new Response('Missing email', { status: 400 });

    const { error } = await resend.emails.send({
      from: FROM,
      to: payload.email,
      subject: subject(payload.status),
      text: body(payload),
    });

    if (error) {
      console.error(error);
      return new Response('Email send failed', { status: 500 });
    }

    return new Response('OK', { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response('Bad Request', { status: 400 });
  }
});