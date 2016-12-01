# nanoISP | Manager
nanoISP | Manager is a little project to manage and control users in an ISP enviroment focusing integration with Ubiquiti's EdgeMAX routers for traffic shapping. Support for Mikrotik RouterOS is also on the list. 

_It´s my first step towards an ISP Management ecosystem and my first opensource project. Pacience :P_

To acomplish this I'm using...
  * FreeRADIUS - for user authentication
  * MySQL Server - as information storage
  * node.js - as the app backend
  * Express.io - for Web frontend
  * Electron - as the Desktop frontend
  * + a bunsh of node.js modules


## What's working so far...

* Web frontend:
  Create users and access profiles
* Captive portal page for Mikrotik Hotspot login (hosted on the RB board)


## Introduction

Essentially, this project permits you, in his current status, to create and manage user and access profiles in FreeRADIUS to authenticate against NAS devices for internet access. It supports sending traffic shapping information using the WISPr-Bandwidth-Max-Down and WISPr-Bandwidth-Max-Up attributes. If your NAS device support those attributes and RADIUS you're good to go.

Futute plans include:
* Dashboard for realtime statistics of current loggedin users and bandwidth ussage
* Captive portal for Hotspot users
* Passport auth module integration
* User portal
* Accounting and payment gateways
* Network monitor
* Localization


## Install Instructions

### Prerequisites

You'll need to install some things first. Please follow the instrucions bellow.

#### 1. node.js
Go to http://node.js and install normally following ther instuctions or via your distros packed manager.
If you're using debian based distro you can use:
```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 2. MySQL
Same here, go to http://mysql.com/ and install normally following ther instuctions or via your distros packed manager.
On debian:
```
sudo apt-get install -y mysql-server
```
After the inicial setup connect to mysql by

#### 3. FreeRADIUS
Again, go to http://freeradius.org/ and install normally following ther instuctions or via your distros packed manager.
Obervation: You need to install FreeRADIUS with MySQL Support.
On debian:
```
sudo apt-get install freeradius freeradius-mysql freeradius-utils
```

Thats it for now. Let's get started...

### nanoISP quick install

Clone the repository, and change to the project dir:
```
git clone https://github.com/fgsants/nanoISP
cd nanoISP
```
Now, install with
```
npm install
```

### Adicional FreeRADIUS and MySQL configuration

To setup those services for nanoISP | Manager execute the following commands.
Observation: Be shure you're still in the project directory.

#### MySQL
Connect to your MySQL instance with root user and password created during install 
```
mysql -u root -p 
database < resources/nanoISP.sql
```
Then create nanoISP database and user
```
CREATE USER 'nano'@'%' IDENTIFIED BY 'nano@2019';GRANT USAGE ON *.* TO 'nano'@'%' IDENTIFIED BY 'Shelly92' WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;CREATE DATABASE IF NOT EXISTS `nanoISP`;GRANT ALL PRIVILEGES ON `nanoISP`.* TO 'nano'@'%';
```
Import db structure
```
source Paht_To_Project_dir/nanoISP/resources/nanoISP.sql
```
Finaly, exit mysql prompt,  then restart MySQL server. On debian based distros use:
```
sudo service mysql restart
```

#### FreeRADIUS
Copy the config files to FreeRADIUS folder.
Observation: Be shure you're still in the project directory.
```
cp resources/clients.conf /etc/freeradius/clients.conf
cp resources/radiusd.conf /etc/freeradius/radiusd.conf
cp resources/sql.conf /etc/freeradius/sql.conf
```
Then edit the clients.conf file and add your NAS Device information.
```
nano /etc/freeradius/clients.conf
```
You will see something like this:
```
client 127.0.0.1 {
	secret		= Rad@2019
    shortname   = localhost
	nastype     = other	
}

client 10.0.1.1 {
       secret    = nano@2019
       shortname = RB1000
       nastype   = mikrotik
}
```
Dont' ever remove the first client. Change the second client's IP and nastype according to your NAS device's information and save the file. You can add as many as you like. nastype 'other' generaly works with most devices.

Restart FreeRADIUS Server. On debian:
```
sudo service freeradius restart
```

That's it. To run and test the web frontend issue
```
npm start
```
and go to http://ip_of_your_server:3000

### Addicional informations

* Don't forget to add your NAS device to the client.conf file
* Setup your NAS device according to his manual with the secret you chossed in the client.conf file

If you encounter any issue please open a new issue. I'm glad to help you.
