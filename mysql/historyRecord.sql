CREATE TABLE IF NOT EXISTS `historyRecord` (
    `recordID`int NOT NULL AUTO_INCREMENT,
    `fileID` int NOT NULL,
    `fileName` varchar(255) NOT NULL,
    `filePath` varchar(255) NOT NULL,
    `groupID` int NOT NULL,
    `ownerID`int NOT NULL,
    `userType`int NOT NULL,
    `status`int NOT NULL DEFAULT 0,
    `approved`int NOT NULL DEFAULT 0,
    `uploadName` varchar(30) NOT NULL,
    PRIMARY KEY(`recordID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;