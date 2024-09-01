export const validateCSV = (records: any[]): boolean => {
    for (const record of records) {
        if (!record['S. No.'] || !record['Product Name'] || !record['Input Image Urls']) {
            console.error(`Validation failed for record: ${JSON.stringify(record)}`);
            return false;
        }
    }
    return true;
};
