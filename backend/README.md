# Smart Healthcare Backend

This is the backend for the Smart Healthcare project, which provides a RESTful API for managing healthcare-related data, including patients, doctors, hospitals, medicines, and health records.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/SmartHealthcare-backend.git
   ```

2. Navigate to the project directory:
   ```
   cd SmartHealthcare-backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your environment variables (see [Environment Variables](#environment-variables) for details).

## Usage

To start the server, run:
```
npm start
```

The server will start on the port specified in the `.env` file (default is 5000).

## API Endpoints

The following endpoints are available:

- **Authentication**
  - `POST /api/auth/login` - Login a user
  - `POST /api/auth/register` - Register a new user

- **Doctors**
  - `GET /api/doctors` - Retrieve all doctors
  - `POST /api/doctors` - Add a new doctor
  - `PUT /api/doctors/:id` - Update doctor information
  - `DELETE /api/doctors/:id` - Delete a doctor

- **Health Records**
  - `GET /api/health-records` - Retrieve all health records
  - `POST /api/health-records` - Create a new health record
  - `PUT /api/health-records/:id` - Update a health record
  - `DELETE /api/health-records/:id` - Delete a health record

- **Hospitals**
  - `GET /api/hospitals` - Retrieve all hospitals
  - `POST /api/hospitals` - Add a new hospital
  - `PUT /api/hospitals/:id` - Update hospital information
  - `DELETE /api/hospitals/:id` - Delete a hospital

- **Medicines**
  - `GET /api/medicines` - Retrieve all medicines
  - `POST /api/medicines` - Add a new medicine
  - `PUT /api/medicines/:id` - Update medicine information
  - `DELETE /api/medicines/:id` - Delete a medicine

- **Patients**
  - `GET /api/patients` - Retrieve all patients
  - `POST /api/patients` - Add a new patient
  - `PUT /api/patients/:id` - Update patient information
  - `DELETE /api/patients/:id` - Delete a patient

## Environment Variables

The following environment variables are required:

- `PORT` - The port on which the server will run (default is 5000).
- `DB_CONNECTION_STRING` - The connection string for the database.
- `JWT_SECRET` - The secret key for JWT authentication.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.