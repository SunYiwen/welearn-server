CREATE TABLE IF NOT EXISTS `user` (
  `userID` int NOT NULL,
  `name` varchar(30) NOT NULL,
  `avatarURL` varchar(255) NOT NULL,
  `phoneNumber` varchar(11) NOT NULL,
  `wxOpenID` varchar(255) NOT NULL,
  `schoolName` varchar(255) DEFAULT '',
  `major` varchar(255) DEFAULT '',
  PRIMARY KEY(`phoneNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;