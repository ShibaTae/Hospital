const express = require('express');
const moment = require('moment-timezone');
const app = express();
const {Client} =  require('pg');
const cors = require('cors');
const { generateHospitalId } = require('../lib/uuid_hospital.js');
const { generateUserId } = require('../lib/uuid_user.js');
const { generatePatientId } = require('../lib/uuid_patient.js');
const { generateReferId } = require('../lib/uuid_refer.js');

app.use(cors());
app.use(express.json());

const router = new Client({
    host : "localhost",
    user : "postgres",
    port : 5433,
    password : "1234",
    database : "postgres"
})

router.connect();

//Add Hospital
app.post('/addHospital', (req, res) => {
    // Generate a unique identifier (UUID) for the hospital ID
    const hospital_id = generateHospitalId();
    const hospital_name = req.body.hospital_name;

    router.query('INSERT INTO hospital_list (hospital_id, hospital_name) VALUES ($1, $2)', [hospital_id, hospital_name], (err, request) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error inserting values"); // Send an error response
        } else {
            console.log("Values inserted successfully");
            res.send("Values inserted successfully"); // Send a success response
        }
    });
});

//List Hospital
app.get('/selectHospital', (req, res) => {
    router.query('SELECT * FROM hospital_list', (err, request) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error selecting values"); // Send an error response
        } else {
            console.log("Values selected successfully");
            res.send(request.rows); // Send a success response
        }
    });
})

//Add User
app.post('/addUser', (req, res) => {
    const user_id = generateUserId();
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const user_name = req.body.user_name;
    const password = req.body.password;
    const hospital_id = req.body.hospital_id;

    router.query('INSERT INTO user_info (user_id, first_name, last_name, user_name, password, hospital_id) VALUES ($1, $2, $3, $4, $5, $6)', [user_id, first_name, last_name, user_name, password, hospital_id], (err, request) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error inserting values"); // Send an error response
        } else {
            console.log("Values inserted successfully");
            res.send("Values inserted successfully"); // Send a success response
        }
    })
})

//Create Patient
app.post('/createPatient',(req,res) => {
    const patient_id = generatePatientId();
    const p_name = req.body.p_name;
    const p_lastname = req.body.p_lastname;
    const id_card = req.body.id_card;
    const birth = req.body.birth;
    const gender = req.body.gender;
    const blood_type = req.body.blood_type;
    const drug_allergy = req.body.drug_allergy;
    const sympton = req.body.sympton;
    const old_sympton = req.body.old_sympton;
    const test_result = req.body.test_result;
    const diagnosis = req.body.diagnosis;
    const medical_right = req.body.medical_right;
    const relative_name = req.body.relative_name;
    const other_reason = req.body.other_reason;
    const create_date = req.body.create_date;
    const update_date = req.body.update_date;

    router.query('INSERT INTO patient_info (patient_id,p_name,p_lastname,id_card,birth,gender,blood_type,drug_allergy,sympton,old_sympton,test_result,diagnosis,medical_right,relative_name,other_reason,create_date,update_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)',[patient_id,p_name,p_lastname,id_card,birth,gender,blood_type,drug_allergy,sympton,old_sympton,test_result,diagnosis,medical_right,relative_name,other_reason,create_date,update_date],(err,result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error inserting values"); // Send an error response
        } else {
            console.log("Values inserted successfully");
            res.send("Values inserted successfully"); // Send a success response
        }
    })
})

//Referral Patient
app.post('/referPatientID', (req, res) => {
    const {patient_id} = req.body
    router.query('SELECT * FROM patient_info WHERE patient_id = $1',[patient_id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json(result.rows[0]); // Assuming only one row is returned
        }
    })
})

//List Patient
app.get('/patients', (req, res) => {
    router.query('SELECT * FROM patient_info', (err, result) => {
        if(err) {
            console.log(err);
        }
        else {
            res.send("values inserted");
        }
    })
})

//Create Refer
app.post('/createRefer', (req, res) => {
    const ref_id = generateReferId();
    const patient_id = req.body.patient_id;
    const refer_reason = req.body.refer_reason;
    const treatment_provided = req.body.treatment_provided;
    const create_date = moment().tz('Asia/Bangkok').format();
    const update_date = moment().tz('Asia/Bangkok').format();
    const from_hospital = req.body.from_hospital;
    const to_hospital = req.body.to_hospital;
    const status = "Pending";

    router.query('INSERT INTO referral (ref_id,patient_id,refer_reason,treatment_provided,create_date,update_date,from_hospital,to_hospital,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', [ref_id,patient_id,refer_reason,treatment_provided,create_date,update_date,from_hospital,to_hospital,status], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error inserting values"); // Send an error response
        } else {
            console.log("Values inserted successfully");
        }
    })
})

// app.get()

// app.post('/createPatients', (req, res) => {
//     const uuid = req.body.patient_id
//     const first_name = req.body.first_name
//     const last_name = req.body.last_name
//     const id_card = req.body.id_card
//     const birth = req.body.birth
//     const gender = req.body.gender
//     const blood_type = req.body.blood_type
//     //const records_id = req.body.records_id
//     const from_hospital = req.body.from_hospital
//     const to_hospital = req.body.to_hospital

//     router.query('INSERT INTO patient_info (patient_id,first_name,last_name,id_card,birth,gender,blood_type,from_hospital,to_hospital) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)', [uuid,first_name,last_name,id_card,birth,gender,blood_type,from_hospital,to_hospital], (err, res) => {
//         if(err) {
//             console.log(err);
//         }
//         else {
//             res.send("Values inserted successfully");
//         }
//     })
// })

// app.post('/createRefers',(req,res) => {
//     const referent_id = req.body.referent_id
//     const his_id = req.body.his_id
//     const refer_date = req.body.refer_date
//     const service_point = req.body.service_point
//     const id_card = req.body.id_card
//     const phone_number = req.body.phone_number
//     const from_hospital = req.body.from_hospital
//     const to_hospital = req.body.to_hospital
//     const first_name = req.body.first_name
//     const last_name = req.body.last_name
//     const gender = req.body.gender
//     const patient_age = req.body.patient_age
//     const drug_allergy = req.body.drug_allergy
//     const sympton = req.body.sympton
//     const old_sympton = req.body.old_sympton
//     const test_result = req.body.test_result
//     const diagnosis = req.body.diagnosis
//     const treatment_provided = req.body.treatment_provided
//     const refer_reason = req.body.refer_reason
//     const medical_right = req.body.medical_right
//     const relative_name = req.body.relative_name
//     const status = req.body.status
//     const other_detail = req.body.other_detail
//     const create_date = req.body.create_date
//     //const update_date = req.body.update_date

//     router.query('INSERT INTO referal (referent_id,his_id,refer_date,service_point,id_card,phone_number,from_hospital,to_hospital,first_name,last_name,gender,patient_age,drug_allergy,sympton,old_sympton,test_result,diagnosis,treatment_provided,refer_reason,medical_right,relative_name,status,other_detail,create_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$19,$20,$21,$22,$23,$24)',
//     [referent_id,his_id,refer_date,service_point,id_card,phone_number,from_hospital,to_hospital,first_name,last_name,gender,patient_age,drug_allergy,sympton,old_sympton,test_result,diagnosis,treatment_provided,refer_reason,medical_right,relative_name,status,other_detail,create_date],(err,result) => {

//     })
// })

app.listen('3001',()=>{
    console.log('Server is running on port 3001');
})
