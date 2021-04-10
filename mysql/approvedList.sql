CREATE TABLE IF NOT EXISTS `approvedList` (
    `groupID` int NOT NULL,
    `fileIDList` text,
    PRIMARY KEY(`groupID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;