const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function uploadData(jsonData) {
  const client = await pool.connect();
  try {
    const queries = jsonData.map((row) => {
      const name = row.name.firstName + " " + row.name.lastName;
      const age = row.age;
      const address = row.address || {};
      delete row.name;
      delete row.age;
      delete row.address;
      const additionalInfo = row || null;

      return {
        text: "INSERT INTO users2 (name, age, address, additional_info) VALUES ($1, $2, $3, $4)",
        values: [name, age, address, additionalInfo],
      };
    });

    await Promise.all(queries.map((query) => client.query(query)));

    // console.log('All queries executed successfully');
  } catch (error) {
    console.error("Error uploading data:", error);
  } finally {
    await client.release();
  }
}
async function calcAgeDis() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT
          CASE
              WHEN age < 20 THEN '< 20'
              WHEN age BETWEEN 20 AND 40 THEN '20 to 40'
              WHEN age BETWEEN 41 AND 60 THEN '40 to 60'
              ELSE '> 60'
          END AS age_group,
          COUNT(*) AS count
      FROM
          users2
      GROUP BY
          age_group
      ORDER BY
          age_group;
    `);

    // console.log('Age-Group % Distribution');
    const totalCount = result.rows.reduce((sum, row) => sum + row.count, 0);

    // console.log(`Age Group \t % Distribution \t (Count)`);
    for (const row of result.rows) {
      row.percentage = (row.count / totalCount) * 100;
      // console.log(`${row.age_group} \t ${row.percentage.toFixed(2)}% \t (${row.count})`);
    }

    return result.rows;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  } finally {
    await client.release();
  }
}

module.exports = { uploadData, calcAgeDis };
