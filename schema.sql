CREATE TABLE faculty(
    id CHAR(10),
    name VARCHAR(30) NOT NULL,
    image BLOB,
    password VARCHAR(20) NOT NULL DEFAULT 'abc123',
    designation VARCHAR(20) NOT NULL,
    PRIMARY KEY(id)
);
CREATE TABLE student(
    usn CHAR(10),
    id CHAR(10),
    name VARCHAR(30) NOT NULL,
    image BLOB,
    password VARCHAR(20) NOT NULL DEFAULT '123abc',
    semester INT NOT NULL,
    section CHAR(1) NOT NULL,
    points_earned INT NOT NULL DEFAULT 0,
    PRIMARY KEY(usn),
    FOREIGN KEY(id) REFERENCES faculty(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE certificate(
    code INT AUTO_INCREMENT,
    usn CHAR(10),
    id CHAR(10),
    name VARCHAR(50) NOT NULL,
    link VARCHAR(2048),
    status BOOLEAN,
    points INT NOT NULL DEFAULT 0,
    category VARCHAR(50),
    time timestamp,
    PRIMARY KEY(code),
    FOREIGN KEY(id) REFERENCES faculty(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(usn) REFERENCES student(usn) ON DELETE CASCADE ON UPDATE CASCADE
);