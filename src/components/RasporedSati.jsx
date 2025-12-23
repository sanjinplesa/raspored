import { useState, useMemo } from 'react'
import { startOfWeek, addWeeks, format, isSameDay } from 'date-fns'
import hr from 'date-fns/locale/hr'

// Podaci za Tjedan A (3., 5. i 7. razredi ujutro)
const tjedanA = {
  '7.10-7.50': { 0: '', ponedjeljak: '', utorak: '', srijeda: '', cetvrtak: '', petak: '' },
  '8.00-8.45': { 1: '', ponedjeljak: 'ENGLESKI JEZIK', utorak: 'HRVATSKI JEZIK', srijeda: 'MATEMATIKA', cetvrtak: 'HRVATSKI JEZIK', petak: 'HRVATSKI JEZIK' },
  '8.50-9.35': { 2: '', ponedjeljak: 'HRVATSKI JEZIK', utorak: 'MATEMATIKA', srijeda: 'HRVATSKI JEZIK', cetvrtak: 'TJELESNI', petak: 'INFORMATIKA' },
  '9.45-10.30': { 3: '', ponedjeljak: 'MATEMATIKA', utorak: 'LIKOVNA KULTURA', srijeda: 'PRIRODA I DRUŠTVO', cetvrtak: 'MATEMATIKA', petak: 'PRIRODA I DRUŠTVO' },
  '10.40-11.25': { 4: '', ponedjeljak: 'INFORMATIKA', utorak: 'SAT RAZREDNIKA', srijeda: 'TJELESNI', cetvrtak: 'VJERONAUK', petak: 'GLAZBENA KULTURA' },
  '11.30-12.15': { 5: '', ponedjeljak: 'TJELESNI', utorak: 'VJERONAUK', srijeda: 'DODATNA NASTAVA', cetvrtak: 'DOPUNSKA NASTAVA', petak: 'ENGLESKI JEZIK' },
  '12.20-13.05': { 6: '', ponedjeljak: 'IZVANNASTAVNA AKTIVNOST', utorak: '', srijeda: '', cetvrtak: '', petak: '' },
}

// Podaci za Tjedan B (4., 6. i 8. razredi ujutro)
const tjedanB = {
  '7.10-7.50': { 0: '', ponedjeljak: '', utorak: '', srijeda: 'DODATNA NASTAVA', cetvrtak: '', petak: '' },
  '8.00-8.45': { 1: '', ponedjeljak: 'TJELESNI', utorak: 'HRVATSKI JEZIK', srijeda: 'MATEMATIKA', cetvrtak: 'HRVATSKI JEZIK', petak: 'HRVATSKI JEZIK' },
  '8.50-9.35': { 2: '', ponedjeljak: 'HRVATSKI JEZIK', utorak: 'MATEMATIKA', srijeda: 'HRVATSKI JEZIK', cetvrtak: 'ENGLESKI JEZIK', petak: 'VJERONAUK' },
  '9.45-10.30': { 3: '', ponedjeljak: 'ENGLESKI JEZIK', utorak: 'TJELESNI', srijeda: 'PRIRODA I DRUŠTVO', cetvrtak: 'TJELESNI', petak: 'MATEMATIKA' },
  '10.40-11.25': { 4: '', ponedjeljak: 'GLAZBENA KULTURA', utorak: 'SAT RAZREDNIKA', srijeda: 'LIKOVNA KULTURA', cetvrtak: 'MATEMATIKA', petak: 'PRIRODA I DRUŠTVO' },
  '11.30-12.15': { 5: '', ponedjeljak: 'INFORMATIKA', utorak: 'INFORMATIKA', srijeda: 'VJERONAUK', cetvrtak: 'DOPUNSKA NASTAVA', petak: '' },
  '12.20-13.05': { 6: '', ponedjeljak: 'IZVANNASTAVNA AKTIVNOST', utorak: '', srijeda: '', cetvrtak: '', petak: '' },
}

const dani = ['ponedjeljak', 'utorak', 'srijeda', 'cetvrtak', 'petak']
const daniHrvatski = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak']

function RasporedSati() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    return startOfWeek(today, { weekStartsOn: 1, locale: hr })
  })

  const [today] = useState(new Date())

  // Određivanje koji je tjedan (A ili B) na osnovu specifičnih datuma
  // Tjedan A (3., 5. i 7. razredi) započinje: 8.9., 22.9., 6.10., 20.10., 3.11., 17.11., 1.12., 15.12., 12.1., 26.1., 9.2., 23.2., 9.3., 23.3., 6.4., 20.4., 4.5., 18.5., 1.6.
  // Tjedan B (4., 6. i 8. razredi) započinje: 15.9., 29.9., 13.10., 27.10., 10.11., 24.11., 8.12., 22.12., 19.1., 2.2., 16.2., 2.3., 16.3., 30.3., 13.4., 27.4., 11.5., 25.5., 8.6.
  const getWeekType = (date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1, locale: hr })
    const year = weekStart.getFullYear()
    const month = weekStart.getMonth() + 1
    const day = weekStart.getDate()
    
    // Kreiraj funkciju za provjeru datuma
    const checkDate = (d, m) => {
      return day === d && month === m
    }
    
    // Provjeri je li početak tjedna u listi Tjedna A (3., 5. i 7. razredi)
    const isTjedanA = 
      checkDate(8, 9) || checkDate(22, 9) ||
      checkDate(6, 10) || checkDate(20, 10) ||
      checkDate(3, 11) || checkDate(17, 11) ||
      checkDate(1, 12) || checkDate(15, 12) ||
      checkDate(12, 1) || checkDate(26, 1) ||
      checkDate(9, 2) || checkDate(23, 2) ||
      checkDate(9, 3) || checkDate(23, 3) ||
      checkDate(6, 4) || checkDate(20, 4) ||
      checkDate(4, 5) || checkDate(18, 5) ||
      checkDate(1, 6)
    
    return isTjedanA ? 'A' : 'B'
  }

  const currentWeekType = useMemo(() => getWeekType(currentWeekStart), [currentWeekStart])
  const todayWeekType = useMemo(() => getWeekType(today), [today])

  const currentSchedule = currentWeekType === 'A' ? tjedanA : tjedanB

  const navigateWeek = (direction) => {
    setCurrentWeekStart(prev => addWeeks(prev, direction))
  }

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1, locale: hr }))
  }

  const exportToCalendar = () => {
    const events = []
    const schedule = currentWeekType === 'A' ? tjedanA : tjedanB

    Object.entries(schedule).forEach(([timeSlot, subjects]) => {
      const [startTime, endTime] = timeSlot.split('-')
      
      dani.forEach((dan, index) => {
        const subject = subjects[dan]
        if (subject && subject.trim() !== '') {
          // Pronađi datum za taj dan u tjednu
          const dayDate = new Date(currentWeekStart)
          dayDate.setDate(currentWeekStart.getDate() + index)
          
          // Parsiraj vrijeme
          const [startHour, startMin] = startTime.split(':').map(Number)
          const [endHour, endMin] = endTime.split(':').map(Number)
          
          const eventStart = new Date(dayDate)
          eventStart.setHours(startHour, startMin, 0, 0)
          
          const eventEnd = new Date(dayDate)
          eventEnd.setHours(endHour, endMin, 0, 0)
          
          events.push({
            start: eventStart,
            end: eventEnd,
            subject: subject,
            timeSlot: timeSlot
          })
        }
      })
    })

    // Generiraj iCal format
    let ical = 'BEGIN:VCALENDAR\n'
    ical += 'VERSION:2.0\n'
    ical += 'PRODID:-//Raspored Sati//EN\n'
    ical += 'CALSCALE:GREGORIAN\n'
    ical += 'METHOD:PUBLISH\n'

    events.forEach((event, index) => {
      const formatDate = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        return `${year}${month}${day}T${hours}${minutes}${seconds}`
      }

      const escapeText = (text) => {
        return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
      }

      const uid = `raspored-sati-${currentWeekType}-${format(event.start, 'yyyyMMdd')}-${index}@raspored-sati.local`

      ical += 'BEGIN:VEVENT\n'
      ical += `UID:${uid}\n`
      ical += `DTSTART:${formatDate(event.start)}\n`
      ical += `DTEND:${formatDate(event.end)}\n`
      ical += `SUMMARY:${escapeText(event.subject)}\n`
      ical += `DESCRIPTION:${escapeText(event.timeSlot)}\n`
      ical += 'END:VEVENT\n'
    })

    ical += 'END:VCALENDAR\n'

    // Preuzmi datoteku
    const blob = new Blob([ical], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `raspored-sati-tjedan-${currentWeekType}-${format(currentWeekStart, 'yyyy-MM-dd')}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const weekDates = useMemo(() => {
    return dani.map((_, index) => {
      const date = new Date(currentWeekStart)
      date.setDate(currentWeekStart.getDate() + index)
      return date
    })
  }, [currentWeekStart])

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Raspored Sati</h1>
            <p className="text-sm text-gray-600 mt-1">
              Tjedan {currentWeekType} • {format(currentWeekStart, 'd. MMMM', { locale: hr })} - {format(addWeeks(currentWeekStart, 1), 'd. MMMM yyyy', { locale: hr })}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Danas
            </button>
            <button
              onClick={exportToCalendar}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
            >
              Export u Kalendar
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateWeek(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            ← Prethodni tjedan
          </button>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              Tjedan {currentWeekType}
            </div>
            <div className="text-sm text-gray-600">
              {format(currentWeekStart, 'd. MMMM', { locale: hr })} - {format(addWeeks(currentWeekStart, 1), 'd. MMMM yyyy', { locale: hr })}
            </div>
          </div>
          <button
            onClick={() => navigateWeek(1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Sljedeći tjedan →
          </button>
        </div>
      </div>

      {/* Timetable */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                  Vrijeme
                </th>
                {daniHrvatski.map((dan, index) => {
                  const date = weekDates[index]
                  const isToday = isSameDay(date, today)
                  return (
                    <th
                      key={dan}
                      className={`px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[140px] ${
                        isToday ? 'bg-blue-50 border-l-2 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div>{dan}</div>
                      <div className={`text-xs mt-1 ${isToday ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                        {format(date, 'd. MMM', { locale: hr })}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(currentSchedule).map(([timeSlot, subjects], rowIndex) => {
                const [startTime] = timeSlot.split('-')
                return (
                  <tr
                    key={timeSlot}
                    className={`hover:bg-gray-50 transition-colors ${
                      rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                      <div className="font-semibold">{timeSlot}</div>
                      <div className="text-xs text-gray-500">{subjects[Object.keys(subjects)[0]]}. sat</div>
                    </td>
                    {dani.map((dan, colIndex) => {
                      const subject = subjects[dan]
                      const date = weekDates[colIndex]
                      const isToday = isSameDay(date, today)
                      return (
                        <td
                          key={dan}
                          className={`px-4 py-3 text-center text-sm ${
                            isToday ? 'bg-blue-50/50 border-l border-r border-blue-200' : ''
                          }`}
                        >
                          {subject && subject.trim() !== '' ? (
                            <div className="font-medium text-gray-900">{subject}</div>
                          ) : (
                            <div className="text-gray-300">—</div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900">
          <strong>Napomena:</strong> Raspored se automatski mijenja između Tjedna A i Tjedna B na osnovu specifičnih datuma početka tjedna.
          {currentWeekType === 'A' && ' Tjedan A: 3., 5. i 7. razredi ujutro'}
          {currentWeekType === 'B' && ' Tjedan B: 4., 6. i 8. razredi ujutro'}
        </p>
      </div>
    </div>
  )
}

export default RasporedSati

