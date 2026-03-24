import * as XLSX from "xlsx";
import toast from "react-hot-toast";

export const exportToExcel = (data, filename = "Report.xlsx") => {
    try {
        if (!data || data.length === 0) {
            toast.error("No data available to export.");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        XLSX.writeFile(workbook, filename);
        toast.success("Excel exported successfully!");
    } catch (error) {
        console.error("Error exporting to Excel:", error);
        toast.error("An error occurred while exporting.");
    }
};

export const printHTMLTable = (data, title = "Report") => {
    try {
        if (!data || data.length === 0) {
            toast.error("No data available to print.");
            return;
        }

        const headers = Object.keys(data[0]);

        let printContent = `
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                        h2 { margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid black; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; text-transform: capitalize; }
                        @media print {
                            @page { size: landscape; }
                        }
                    </style>
                </head>
                <body>
                    <h2>${title}</h2>
                    <table>
                        <thead>
                            <tr>
                                ${headers.map(h => `<th>${h.replace(/_/g, ' ')}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(row => `
                                <tr>
                                    ${Object.values(row).map(val => `<td>${val !== null && val !== undefined ? val : ''}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <script>
                        window.onload = function() {
                            window.print();
                        };
                    </script>
                </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
        } else {
            toast.error("Failed to open print window. Please allow popups.");
        }
    } catch (error) {
        console.error("Error printing report:", error);
        toast.error("An error occurred while printing.");
    }
};
