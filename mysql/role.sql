CREATE TABLE IF NOT EXISTS `role` (
    `userID` int NOT NULL,
    `userType` int NOT NULL,
    `groupID` int NOT  NULL,
    `groupName` varchar(30) NOT NULL,
    `subject` varchar(255) NOT NULL,
    `schoolName` varchar(255) NOT NULL,
    PRIMARY KEY(`userID`, `userType`, `groupID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;