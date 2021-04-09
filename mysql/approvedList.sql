CREATE TABLE IF NOT EXISTS `approvedList` (
    `groupID` int NOT NULL,
    `recordIDList` text,
    PRIMARY KEY(`groupID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;