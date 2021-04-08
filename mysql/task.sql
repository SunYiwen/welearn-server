CREATE TABLE IF NOT EXISTS `task` (
    `taskID` int NOT NULL AUTO_INCREMENT,
    `taskName` varchar(255) NOT NULL,
    `taskType` varchar(255),
    `groupID` int NOT NULL,
    `createdUserID` int NOT NULL, 
    `status` int NOT NULL,
    `softDelete` int DEFAULT 0,
    `expiredAt` datetime NOT NULL,
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL,
    `subject` varchar(255),
    `contentDetail` text NOT NULL,
    `answerStatus` text,
    PRIMARY KEY(`taskID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;