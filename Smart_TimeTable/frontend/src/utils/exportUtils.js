import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function exportTimetableToPDF(timetable, fileName = 'timetable.pdf') {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    // Title
    doc.setFontSize(20)
    doc.text('Smart TimeTable', 14, 15)

    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22)

    // Get timetable data
    const days = Object.keys(timetable.timetable)
    const slots = timetable.timetable[days[0]] || []

    // Create table data
    const tableData = slots.map((slot, idx) => [
      `${slot.start_time} - ${slot.end_time}`,
      ...days.map((day) => {
        const cellSlot = timetable.timetable[day][idx]
        let text = cellSlot.subject
        if (cellSlot.teacher) text += `\n(${cellSlot.teacher})`
        if (cellSlot.room) text += `\nRoom: ${cellSlot.room}`
        return text
      }),
    ])

    // Add table
    autoTable(doc, {
      head: [['Time', ...days]],
      body: tableData,
      startY: 30,
      didDrawPage: function (data) {
        // Footer
        const pageSize = doc.internal.pageSize
        const pageHeight = pageSize.getHeight()
        const pageWidth = pageSize.getWidth()
        doc.setFontSize(9)
        doc.setTextColor(128)
        doc.text(
          `Page ${data.pageNumber}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        )
      },
      margin: { top: 30, right: 10, bottom: 15, left: 10 },
      styles: {
        fontSize: 9,
        cellPadding: 6,
        overflow: 'linebreak',
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 248, 255],
      },
    })

    // Save PDF
    doc.save(fileName)
    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}

export function exportTimetableToCSV(timetable, fileName = 'timetable.csv') {
  try {
    const days = Object.keys(timetable.timetable)
    const slots = timetable.timetable[days[0]] || []

    // Create CSV content
    let csv = 'Time,' + days.join(',') + '\n'

    slots.forEach((slot, idx) => {
      const row = [`${slot.start_time} - ${slot.end_time}`]
      days.forEach((day) => {
        const cellSlot = timetable.timetable[day][idx]
        let text = cellSlot.subject
        if (cellSlot.teacher) text += ` (${cellSlot.teacher})`
        if (cellSlot.room) text += ` - Room ${cellSlot.room}`
        row.push(`"${text}"`)
      })
      csv += row.join(',') + '\n'
    })

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return true
  } catch (error) {
    console.error('Error generating CSV:', error)
    throw error
  }
}

export function exportTimetableToJSON(timetable, fileName = 'timetable.json') {
  try {
    const data = {
      exportDate: new Date().toISOString(),
      timetable,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json;charset=utf-8;',
    })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return true
  } catch (error) {
    console.error('Error generating JSON:', error)
    throw error
  }
}
