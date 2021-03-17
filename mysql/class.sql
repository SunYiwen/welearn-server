CREATE TABLE IF NOT EXISTS `class` (
    `groupID` int NOT NULL AUTO_INCREMENT,
    `groupName` varchar(30) NOT NULL,
    `schoolID` int NOT NULL, 
    `code` varchar(6) NOT NULL,
    `studentNumber` int NOT NULL DEFAULT 0,
    `schoolName` varchar(255) NOT NULL,
    `subject` varchar(255) NOT NULL,
    `isOpen` int DEFAULT 0,
    `status` int DEFAULT 0,
    PRIMARY KEY(`groupID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;