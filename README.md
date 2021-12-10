# LifeTreeWNY
I Susmitha has pushed changes to lifetree-dashboard and lifetree-api . 
Below 2 columns are to be created in db for proposals
`Job Status` varchar(255) DEFAULT NULL,
`Employee Notes` varchar(15000) DEFAULT NULL,

I susmitha has pushed changes for the bugs to lifetree-dashboard/src/pages/employee

For Follow Up Email Feature a new table has to be created:
 ```
 CREATE TABLE `email` (
  `title` varchar(500) DEFAULT NULL,
  `message` varchar(500) DEFAULT NULL,
  `cron` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

A default entry for the Email table is given below:
```
INSERT INTO `customers`.`email` (`title`, `message`, `cron`) VALUES ('Testing Title','Testing Message','* * * * *');
```
