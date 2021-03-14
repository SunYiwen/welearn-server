CREATE TABLE IF NOT EXISTS `role` (
    `userID` int NOT NULL,
    `userType` int NOT NULL,
    `groupID` int NOT  NULL,
    PRIMARY KEY(`userID`, `userType`, `groupID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;