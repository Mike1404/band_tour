# Script par Erick Paquin et Michael Gabriel le 3 Novembre 2016.
#
# create user and database
#create user 'tour_manager'@'localhost' identified by 'abcd';
drop database if exists tour_finance;
create database tour_finance;

use tour_finance;
#grant all privileges on *.* to 'tour_manager'@'localhost';

# create tables
create table band(
id int primary key auto_increment,
band_name varchar(256) unique, index(band_name),
financial_status varchar(256)
);

create table city(
id int primary key auto_increment,
city_name varchar(256), index(city_name),
tour_date date, index(tour_date)
# band_pay decimal(6,2), index(band_pay)
);

create table finances(
id int primary key auto_increment,
band_name varchar(256), index(band_name),
tour_date date, index(tour_date),
spendings decimal(6,2), index(spendings),
revenues decimal(6,2), index(revenues)
);


# add foreign keys if needed...

alter table finances
add foreign key (band_name) references band(band_name),
add foreign key (tour_date) references city(tour_date);
# add foreign key (revenues) references city(band_pay);