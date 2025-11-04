<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![GNU GENERAL PUBLIC LICENSE][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/BradHeff/Horizon-Fee-Calculator">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Horizon Fee Calculator</h3>

  <p align="center">
    School Fee's Calculator for Horizon Christian School.
    <br />
    <a href="https://github.com/BradHeff/Horizon-Fee-Calculator"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/bradheff/Horizon-Fee-Calculator/issues">Report Bug</a>
    ·
    <a href="https://github.com/bradheff/Horizon-Fee-Calculator/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#todo">TODO:</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#dynamic-fee-system">Dynamic Fee System</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![GUI Screen Shot][product-screenshot]](https://github.com/BradHeff/Horizon-Fee-Calculator/blob/main/images/screenshot1.png)

This is a modern, responsive web application for calculating school fees for Horizon Christian School. The application features a user-friendly interface with Material-UI components and a dynamic fee management system that allows administrators to update fee structures without code changes.

## ✨ Recent Major Updates

### Dynamic Fee Management System
The calculator now includes a comprehensive dynamic fee management system:

- **Configuration-Driven Fees**: All fee structures are stored in JSON configuration files
- **Admin Interface**: Web-based tool for non-technical staff to update fees
- **Automatic Calculations**: Intelligent fee calculations with family and staff discounts
- **Version Control**: Track fee changes and maintain audit trails
- **Spreadsheet Integration**: Import/export capabilities for easy fee updates

### Modern UI Design
Complete redesign using Material-UI with:
- **Horizon Branding**: Custom theme using school colors (#2E5D4A forest green, #F4B942 gold)
- **Parent-Friendly UX**: Step-by-step process with clear explanations
- **Mobile Responsive**: Optimized for all devices and screen sizes
- **Accessibility**: WCAG compliant design for all users

### Key Features
- Multi-campus support (Balaklava and Clare)
- Automatic sibling discounts (2nd child 25% off, 3rd child 50% off, 4th+ free)
- Staff discount support (25% configurable discount)
- Concession card holder discounts
- Transport fee calculations
- Real-time fee previews with detailed breakdowns

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![React][react]][react-url]
- [![Redux][redux]][redux-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

Software needed for this application to work

- python 3.8
- - Windows:
- - - [Install Reactjs](react-url)
- - Linux:
- - - Ubuntu/Debian
- - - - `sudo apt install nodejs npm`
- - - Fedora
- - - - `sudo dnf install nodejs npm`

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/bradheff/Horizon-Fee-Calculator.git
   ```
2. Navigate to Horizon-Fee-Calculator `cd Horizon-Fee-Calculator`
3. Install node modules `npm install`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

1. Run project `npm start`
2. In browser open `http://localhost:3000`

<!-- _For more examples, please refer to the [Documentation](https://github.com/BradHeff/Horizon-Fee-Calculator/wiki)_ -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- DYNAMIC FEE SYSTEM -->

## Dynamic Fee System

The application now includes a sophisticated fee management system that eliminates hardcoded fee structures and enables non-technical staff to update fees easily.

### For School Administrators

**Updating Fees Without Code Changes:**
1. Navigate to the Fee Administration interface (when implemented)
2. Select the appropriate campus (Balaklava or Clare)
3. Update fee amounts using the visual editor
4. Preview changes and save the new configuration
5. Download backup of the updated fee structure

**Alternative Method - Direct File Update:**
1. Edit `src/data/fee-config.json` with new fee amounts
2. Update the version number and last updated date
3. Validate the JSON format is correct
4. Deploy the updated configuration

### For Developers

**Using the Enhanced Fee System:**
```javascript
import FeeConfigService from './services/FeeConfigService';

// Calculate fees for a family
const familyFees = FeeConfigService.calculateFamilyFees(
  [{ yearLevel: 'year7' }, { yearLevel: 'year9' }],
  0, // Campus: 0=Balaklava, 1=Clare
  false, // Has concession card
  true, // Is staff member  
  true // Has bus fees
);

console.log(`Total fees: $${familyFees.grandTotal}`);
```

**CSV to JSON Conversion:**
```bash
# Generate template CSV for fee updates
node scripts/csv-to-json-converter.js --template fees-template.csv

# Convert updated CSV to JSON configuration
node scripts/csv-to-json-converter.js fees-2026.csv src/data/fee-config.json
```

### Key Benefits

- **No Code Changes Required**: Update fees through configuration files
- **Version Control**: Track all fee changes with automatic versioning
- **Error Prevention**: Built-in validation prevents configuration mistakes  
- **Audit Trail**: Complete history of who changed what and when
- **Backup/Restore**: Easy export and import of fee configurations
- **Spreadsheet Integration**: Convert Excel/CSV files to system format

### Technical Features

- Automatic sibling discounts (25%, 50%, 100% for 2nd, 3rd, 4th+ children)
- Configurable staff discount percentage
- Campus-specific fee structures
- Concession card holder support
- Transport fee management
- Real-time fee calculations
- Configuration validation and error checking

For detailed technical documentation, see [DYNAMIC_FEE_SYSTEM.md](DYNAMIC_FEE_SYSTEM.md)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

### ✅ Completed Features
- [x] Create Stylish Webpage (Material-UI redesign with Horizon branding)
- [x] Create Functions and Features (Enhanced calculator with step-by-step process)
- [x] Improve Fee Calculations
  - [x] Add bus fees with family discounts
  - [x] Add discount % for Concession Card holders
  - [x] Return correct pricing with all discounts applied
  - [x] Staff discount system (25% configurable)
  - [x] Automatic sibling discounts
- [x] Return table view of fees per term (Enhanced breakdown table)
- [x] Dynamic Fee Management System
  - [x] Configuration-driven fee structures
  - [x] CSV to JSON conversion tools
  - [x] Fee administration interface
  - [x] Version control and audit trails

### 🚧 In Progress
- [ ] Fee Administration Interface (UI complete, backend integration pending)
- [ ] Historical fee tracking and reporting
- [ ] Multi-year fee planning tools

### 📋 Planned Features
- [ ] Integration with school management systems
- [ ] Automated fee updates from external sources
- [ ] Payment plan calculator
- [ ] Fee comparison tools between academic years
- [ ] Email fee estimates to families
- [ ] Print-friendly fee statements
- [ ] Mobile app version
- [ ] Multi-language support

See the [open issues](https://github.com/bradheff/Horizon-Fee-Calculator/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

-->

<!-- LICENSE -->

## License

Distributed under the GPL-3.0 License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Brad Heffernan - [@bradheffernan](https://twitter.com/bradheffernan) - brad.heffernan83@outlook.com

Project Link: [https://github.com/bradheff/Horizon-Fee-Calculator](https://github.com/bradheff/Horizon-Fee-Calculator)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/bradheff/Horizon-Fee-Calculator.svg?style=for-the-badge
[contributors-url]: https://github.com/bradheff/Horizon-Fee-Calculator/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/bradheff/Horizon-Fee-Calculator.svg?style=for-the-badge
[forks-url]: https://github.com/bradheff/Horizon-Fee-Calculator/network/members
[stars-shield]: https://img.shields.io/github/stars/bradheff/Horizon-Fee-Calculator.svg?style=for-the-badge
[stars-url]: https://github.com/bradheff/Horizon-Fee-Calculator/stargazers
[issues-shield]: https://img.shields.io/github/issues/bradheff/Horizon-Fee-Calculator.svg?style=for-the-badge
[issues-url]: https://github.com/bradheff/Horizon-Fee-Calculator/issues
[license-shield]: https://img.shields.io/github/license/bradheff/Horizon-Fee-Calculator.svg?style=for-the-badge
[license-url]: https://github.com/BradHeff/Horizon-Fee-Calculator/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/brad-heffernan83/
[product-screenshot]: images/screenshot1.png
[about-screenshot]: images/Screenshot_about.png
[error-screenshot]: images/Screenshot_error.png
[menu-screenshot]: images/Screenshot_menu.png
[Redux]: https://img.shields.io/badge/redux-35495E?style=for-the-badge&logo=redux&logoColor=61DAFB
[React]: https://img.shields.io/badge/react-35495E?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://react.dev/
[redux-url]: https://redux.js.org/
