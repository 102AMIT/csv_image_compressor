import { parse } from 'csv-parse';

export const parseCSV = async (csvData: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        parse(csvData, { columns: true, trim: true }, (err, records) => {
            if (err) return reject(err);
            resolve(records);
        });
    });
};
