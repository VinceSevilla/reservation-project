import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ReservationCalendar() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const { data } = await supabase
      .from('reservations')
      .select(`
        id,
        date,
        start_time,
        end_time,
        status,
        purpose,
        rooms ( name )
      `);

    const formatted = data?.map((r) => ({
      id: r.id,
      title: `${r.rooms.name} - ${r.purpose}`,
      start: `${r.date}T${r.start_time}`,
      end: `${r.date}T${r.end_time}`,
      color:
        r.status === 'approved'
          ? 'green'
          : r.status === 'pending'
          ? 'orange'
          : 'red',
    }));

    setEvents(formatted || []);
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      events={events}
      height="auto"
    />
  );
}
