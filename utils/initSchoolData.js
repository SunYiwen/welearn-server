const data = require('../data/school');
const { query } = require('./mysql/db');

const execute = async () => {
    for (let proviceItem of data) {

        const provice = proviceItem.province_name;
        const cities = proviceItem.cities;
        for (let cityItem of cities) {
            const city = cityItem.city_name;
            const universities = cityItem.universities;
            for (let university of universities) {

                const sql = 'INSERT INTO school set ?';
                const schoolName = university;
                const params = {
                    provice, city, schoolName
                }
                await query(sql, params);
            }
        }
    }

    console.log('school data finished!');

}

execute();

