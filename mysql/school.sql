CREATE TABLE IF NOT EXISTS `school` (
  `schoolID` int NOT NULL AUTO_INCREMENT,
  `provice` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `schoolName` varchar(255) NOT NULL,
  PRIMARY KEY(`schoolID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;