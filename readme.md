
# Express.js Application

This is a simple Express.js application.

```markdown
Prerequisites

Before you begin, ensure you have met the following requirements:

- **You have installed Node.js. You can download it from [nodejs.org](https://nodejs.org/).**
- **You have a package manager such as npm or yarn installed. npm comes with Node.js installation.**
- **You have a nodemon library. used for development purposes.**

```

## Installing the Dependencies and Run App

To install the dependencies, run the following command in the root directory of the project:

This command installs all the packages listed in the `package.json` file.

```bash
npm install
npm start
```

## Development Mode

For development purposes, it is often useful to use `nodemon` to automatically restart the server when file changes in the directory are detected. You can run the application in development mode using:

```bash
npm run dev
```

## Environment Variables

You can set environment variables for your application using a `.env` file. Create a `.env` file in the root directory and add your variables there:

```env
DB_NAME=hospital
DB_USER=root
DB_PASS=
DB_HOST=localhost
PORT=3000
```


## API Documentation
```

1.  endpoint `/api/registration/report/kabupaten?startDate='2022-01-01'&endDate='2022-10-31'&pageSize=10&provinsiId=98`
2.  endpoint `/api/registration/report/kecamatan?startDate='2022-01-01'&endDate='2022-10-31'&pageSize=10&kabupatenId=98`
3.  endpoint `/api/registration/report/kelurahan?startDate='2022-01-01'&endDate='2022-10-31'&pageSize=10&kecamatanId=98`

additional queryParam 
pageSize, page
```
