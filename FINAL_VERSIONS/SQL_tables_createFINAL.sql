# Script par Erick Paquin et Michael Gabriel le 3 Novembre 2016.
#
# create user and database
# create user 'tour_manager'@'localhost' identified by 'abcd';
drop database if exists tour_finance;
create database tour_finance;

use tour_finance;
#grant all privileges on *.* to 'tour_manager'@'localhost';

# create tables
create table band(
id int primary key auto_increment, index(id),
band_name varchar(256) unique
#financial_status varchar(256)
);

create table city(
id int primary key auto_increment, index(id),
city_name varchar(256),
tour_date varchar(256)
# band_pay decimal(6,2), index(band_pay)
);

create table finances(
id int primary key auto_increment, index(id),
band_id INT, index(band_id),
tour_date_id INT, index(tour_date_id),
spendings int(6), index(spendings),
revenues int(6), index(revenues)
);


# add foreign keys if needed...

alter table finances
add foreign key (band_id) references band(id),
add foreign key (tour_date_id) references city(id);