# Odoo 18 Employee Management Mobile App

A React Native mobile application built with Expo for managing Odoo employee
records through the Odoo JSON-RPC API.

The app supports Odoo login, employee listing, search, create, update, delete,
profile image upload during creation, and manager selection through the
`hr.employee` `parent_id` many2one relationship.

## Features

### Authentication

- Connect to an Odoo JSON-RPC endpoint from the login screen.
- Authenticate with database name, username, and password.
- Save the server URL, database, and username locally with AsyncStorage.
- Keep the password out of local storage.
- Logout from the employee list screen.

### Employee Management

- Fetch employee records from Odoo.
- Search employees by name.
- Pull to refresh the employee list.
- Display employee photos from Odoo `image_1920` data.
- Show initials when an employee has no photo.
- Create employees with name, email, job title, optional photo, and manager.
- Edit employee name, email, job title, and manager.
- Delete employees from Odoo with confirmation.

## Technologies Used

| Technology | Purpose |
| --- | --- |
| React Native | Mobile app UI |
| Expo SDK 54 | React Native app framework |
| Odoo 18 | ERP backend |
| JSON-RPC | Odoo API communication |
| Axios | HTTP requests |
| React Navigation | Screen navigation |
| NativeWind | Tailwind-style React Native styling |
| Expo Image Picker | Employee photo selection |
| AsyncStorage | Save non-sensitive connection details |
| React Native Element Dropdown | Manager selection dropdown |
| Expo Vector Icons | App icons |

## Project Structure

```text
odoo-employee-mobileapp/
+-- README.md
`-- EmployeeApp/
    +-- App.js
    +-- app.json
    +-- babel.config.js
    +-- global.css
    +-- metro.config.js
    +-- package.json
    +-- tailwind.config.js
    +-- assets/
    `-- src/
        +-- components/
        |   +-- AppButton.js
        |   +-- AppInput.js
        |   +-- ScreenShell.js
        |   `-- SectionCard.js
        +-- config/
        |   `-- config.js
        +-- navigation/
        |   `-- AppNavigator.js
        +-- screen/
        |   +-- AddEmployeeScreen.js
        |   +-- EditEmployeeScreen.js
        |   +-- EmployeeListScreen.js
        |   `-- LoginScreen.js
        `-- services/
            `-- odooApi.js
```

## Odoo API Overview

This project communicates with Odoo through the JSON-RPC endpoint:

```text
http://YOUR-IP:8069/jsonrpc
```

### Login Request

```json
{
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    "service": "common",
    "method": "login",
    "args": ["database_name", "username", "password"]
  },
  "id": 1
}
```

### Employee Model

The app uses the Odoo `hr.employee` model.

| Field | Type | Usage |
| --- | --- | --- |
| `name` | Char | Employee name |
| `work_email` | Char | Employee email |
| `job_title` | Char | Job title |
| `image_1920` | Binary | Employee profile image |
| `parent_id` | Many2one(`hr.employee`) | Manager relationship |

### CRUD Methods

| Action | Odoo Method |
| --- | --- |
| Login | `common.login` |
| Read employees | `search_read` |
| Create employee | `create` |
| Update employee | `write` |
| Delete employee | `unlink` |

Example `search_read` request:

```js
await axios.post(baseUrl, {
  jsonrpc: '2.0',
  method: 'call',
  params: {
    service: 'object',
    method: 'execute_kw',
    args: [
      db,
      uid,
      password,
      'hr.employee',
      'search_read',
      [[]],
      {
        fields: [
          'name',
          'work_email',
          'job_title',
          'image_1920',
          'parent_id',
        ],
      },
    ],
  },
  id: 2,
});
```

## Installation

### Prerequisites

- Node.js and npm
- Expo Go on an Android or iOS device
- Running Odoo 18 server with the Employees app installed
- Mobile device and Odoo server on the same network

### Setup

```bash
cd EmployeeApp
npm install
npx expo start
```

Then scan the QR code with Expo Go.

## Odoo Connection Setup

### Find Your Local IP Address on Windows

```powershell
ipconfig
```

Look for the IPv4 address under your active Wi-Fi or hotspot adapter.

Example:

```text
IPv4 Address . . . . . . . . . . . : 10.165.68.93
```

Use it in the app as:

```text
http://10.165.68.93:8069/jsonrpc
```

### Network Notes

- The phone and laptop/server must be on the same Wi-Fi or hotspot.
- Windows Firewall must allow inbound TCP traffic on port `8069`.
- If the Wi-Fi IP address changes, update the JSON-RPC URL in the login screen.

## Screens

### Login Screen

- Enter Odoo JSON-RPC URL, database, username, and password.
- Authenticate with Odoo.
- Save reusable connection details except the password.

### Employee List Screen

- Load employees from Odoo.
- Search employees by name.
- Pull to refresh.
- Open an employee for editing.
- Logout with confirmation.

### Add Employee Screen

- Create a new employee.
- Add name, email, and job title.
- Select a manager from existing employees.
- Choose a profile photo from the media library.
- Upload the photo as base64 data to `image_1920`.

### Edit Employee Screen

- Update name, email, job title, and manager.
- Delete the employee record after confirmation.

## Important Implementation Notes

- The app stores the Odoo `uid` in memory after login.
- The password is used for JSON-RPC object calls but is not saved to
  AsyncStorage.
- The default URL in `EmployeeApp/src/config/config.js` is only a development
  fallback and should be changed to match your local Odoo server.
- Employee image editing is not implemented yet. Image upload currently happens
  when creating a new employee.
- Manager names are fetched through `parent_id`, but the current employee card
  UI does not display the manager name yet.

## Common Problems and Fixes

| Problem | Cause | Fix |
| --- | --- | --- |
| Login fails | Wrong database, username, password, or URL | Recheck Odoo login details and JSON-RPC endpoint |
| Mobile cannot connect | Device and server are on different networks | Use the same Wi-Fi or hotspot |
| Connection timeout | Firewall blocks Odoo | Allow TCP port `8069` in Windows Firewall |
| URL stops working | Local IP address changed | Run `ipconfig` again and update the app URL |
| Odoo field error | Incorrect field name in API call | Use valid fields such as `name`, `work_email`, `job_title`, `image_1920`, and `parent_id` |

## Future Improvements

- Edit employee profile photos.
- Display manager name on employee cards.
- Add employee detail screen.
- Add department management.
- Add attendance management.
- Add QR code based connection setup.
- Add dark/light theme toggle.
- Add offline cache and sync.
- Add push notifications.

## Learning Outcomes

This project demonstrates:

- Odoo JSON-RPC authentication.
- Mobile CRUD operations with Odoo models.
- Many2one relationship handling with `parent_id`.
- Image selection and base64 upload from Expo.
- React Navigation stack routing.
- Reusable React Native UI components.
- NativeWind styling in an Expo project.

## Conclusion

This app shows how a React Native and Expo mobile application can connect to
Odoo 18 through JSON-RPC and manage real employee records from a mobile
interface. It is a focused foundation for a larger HR mobile app with employee,
attendance, payroll, and department workflows.
