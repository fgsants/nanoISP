
use nanoISP;

CREATE TABLE IF NOT EXISTS `clients` (
`ID` int(11) NOT NULL,
  `fullname` varchar(64) NOT NULL,
  `email` varchar(48) NOT NULL,
  `socialID` varchar(64) NOT NULL,
  `birth` date DEFAULT NULL,
  `phone1` varchar(24) DEFAULT NULL,
  `phone2` varchar(24) DEFAULT NULL,
  `add_street` varchar(64) DEFAULT NULL,
  `add_number` decimal(6,0) DEFAULT NULL,
  `add_district` varchar(64) DEFAULT NULL,
  `add_zip` varchar(12) DEFAULT NULL,
  `add_city` varchar(32) DEFAULT NULL,
  `add_state` varchar(32) DEFAULT NULL,
  `username` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `radcheck` (
`ID` int(11) NOT NULL,
  `username` varchar(64) NOT NULL,
  `attribute` varchar(64) DEFAULT NULL,
  `op` char(2) DEFAULT NULL,
  `value` varchar(253) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `radgroupreply` (
`ID` int(11) NOT NULL,
  `groupname` varchar(64) DEFAULT NULL,
  `attribute` varchar(64) DEFAULT NULL,
  `op` char(2) DEFAULT NULL,
  `value` varchar(253) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `radreply` (
`ID` int(11) NOT NULL,
  `username` varchar(64) NOT NULL,
  `Attribute` varchar(64) DEFAULT NULL,
  `op` char(2) DEFAULT NULL,
  `value` varchar(253) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `radusergroup` (
  `username` varchar(64) NOT NULL,
  `groupname` varchar(64) DEFAULT NULL,
  `priority` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `clients`
 ADD PRIMARY KEY (`ID`), ADD UNIQUE KEY `socialID` (`socialID`), ADD KEY `username` (`username`);

ALTER TABLE `radcheck`
 ADD PRIMARY KEY (`ID`), ADD UNIQUE KEY `username` (`username`);

ALTER TABLE `radgroupreply`
 ADD PRIMARY KEY (`ID`);

ALTER TABLE `radreply`
 ADD PRIMARY KEY (`ID`), ADD UNIQUE KEY `username` (`username`);

ALTER TABLE `radusergroup`
 ADD UNIQUE KEY `username` (`username`);

ALTER TABLE `clients`
MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `radcheck`
MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `radgroupreply`
MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `radreply`
MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `clients`
ADD CONSTRAINT `clients_ibfk_1` FOREIGN KEY (`username`) REFERENCES `radcheck` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `radreply`
ADD CONSTRAINT `radreply_ibfk_1` FOREIGN KEY (`username`) REFERENCES `radcheck` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `radusergroup`
ADD CONSTRAINT `radusergroup_ibfk_1` FOREIGN KEY (`username`) REFERENCES `radcheck` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;