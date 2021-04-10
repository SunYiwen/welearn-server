CREATE TABLE IF NOT EXISTS `file` (
    `fileID` int NOT NULL AUTO_INCREMENT,
    `fileName` varchar(255) NOT NULL,
    `filePath` varchar(255) NOT NULL,
    `groupID` int NOT NULL,
    `ownerID`int NOT NULL,
    `userType`int NOT NULL,
    `status`int NOT NULL DEFAULT 0,
    PRIMARY KEY(`fileID`, `fileName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;