CREATE TABLE IF NOT EXISTS `job` (
    `jobID` int NOT NULL AUTO_INCREMENT,
    `taskID` int NOT NULL,
    `groupID` int NOT NULL,
    `studentUserID` int NOT NULL,
    `studentName` varchar(255) NOT NULL,
    `studentAvatar` varchar(255) NOT NULL,
    `status` int NOT NULL,
    `expiredAt` datetime NOT NULL,
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL,
    `scoreInfo` text NOT NULL,
    PRIMARY KEY(`jobID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;