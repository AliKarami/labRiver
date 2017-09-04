#!/usr/bin/env bash

#--------------< Installing NodeJS >--------------#

cd ~
curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo rm nodesource_setup.sh
sudo apt-get install nodejs
sudo apt-get install build-essential

#--------------</ Installing NodeJS >--------------#

#--------------< Installing MongoDB >--------------#

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo echo '[Unit]
Description=High-performance, schema-free document-oriented database
After=network.target

[Service]
User=mongodb
ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf

[Install]
WantedBy=multi-user.target' > /etc/systemd/system/mongodb.service
sudo systemctl start mongodb
sudo systemctl status mongodb
sudo systemctl enable mongodb

#--------------</ Installing MongoDB >--------------#

#--------------< Installing Required Packages >--------------#

sudo apt-get install git
sudo npm install bower -g
sudo npm install pm2 -g

#--------------</ Installing Required Packages >--------------#

#--------------< Installing Source Code >--------------#

git clone https://github.com/AliKarami/labRiver.git
cd labRiver
git pull
npm install
bower install

#--------------</ Installing Source Code >--------------#
