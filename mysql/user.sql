CREATE TABLE IF NOT EXISTS `user` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `userType` int NOT NULL DEFAULT 0,
  `avatarURL` varchar(255) NOT NULL,
  `phoneNumber` varchar(11) NOT NULL,
  `wxOpenID` varchar(255) NOT NULL,
  `schoolName` varchar(255) DEFAULT '',
  `major` varchar(255) DEFAULT '',
  PRIMARY KEY(`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8