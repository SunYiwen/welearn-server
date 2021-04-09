CREATE TABLE IF NOT EXISTS `record` (
    `recordID` int NOT NULL AUTO_INCREMENT,
    `fileID` varchar(255) NOT NULL,
    `groupID` int NOT NULL,
    PRIMARY KEY(`recordID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;