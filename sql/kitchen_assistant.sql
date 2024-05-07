-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 06, 2024 at 10:49 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kitchen_assistant`
--

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `ingredients` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]',
  `description` longtext NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`id`, `title`, `ingredients`, `description`, `user_id`) VALUES
(1, 'Bolognai spagetti', '[{\"ingredientName\":\"Vöröshagyma\",\"amount\":\"1\",\"unit\":\"db\"},{\"ingredientName\":\"Sárgarépa\",\"amount\":\"1\",\"unit\":\"db\"},{\"ingredientName\":\"Olívaolaj\",\"amount\":\"2\",\"unit\":\"ek\"},{\"ingredientName\":\"Darált hús\",\"amount\":\"25\",\"unit\":\"dkg\"},{\"ingredientName\":\"Bors\",\"amount\":\"\",\"unit\":\"\"},{\"ingredientName\":\"Bazsalikom\",\"amount\":\"1\",\"unit\":\"tk\"},{\"ingredientName\":\"Passzírozott paradicsom\",\"amount\":\"3\",\"unit\":\"dl\"},{\"ingredientName\":\"Só\",\"amount\":\"\",\"unit\":\"\"},{\"ingredientName\":\"Zellerszál levéllel\",\"amount\":\"1\",\"unit\":\"db\"},{\"ingredientName\":\"Fokhagyma\",\"amount\":\"3\",\"unit\":\"gerezd\"},{\"ingredientName\":\"Édesítő\",\"amount\":\"2\",\"unit\":\"csepp\"},{\"ingredientName\":\"Spagetti tészta\",\"amount\":\"25\",\"unit\":\"dkg\"},{\"ingredientName\":\"Reszelt sajt\",\"amount\":\"15\",\"unit\":\"dkg\"}]', 'A hagymát apróra vágjuk, a sárgarépát lereszeljük.\r\nAz olajon sárgára pirítjuk a hagymát, rátesszük a darált húst, megszórjuk a sóval, a borssal, a bazsalikommal és az oregánóval. Addig kevergetjük, míg fehéredni kezd, ekkor felöntjük a paradicsomlével.\r\nHozzáadjuk a répát és a zellerszárat, felöntjük egy kevés vízzel, hogy a megszokott állagnál hígabb szaftot kapjunk. Fedő alatt, alacsony lángon kb. 1 órát főzzük.\r\nÖt perccel a főzési idő letelte előtt belenyomjuk a fokhagymát, és hozzáadunk pár csepp édesítőt (vagy egy-két csipet cukrot). Amikor kész, megkóstoljuk, ha kell, utánaízesítjük.\r\nKözben kifőzzük a spagettit, a csomagoláson található utasítás szerint, és lereszeljük a sajtot.\r\nA bolognai spagetti tálaláskor egy adag tésztát a tányérra teszünk, rákanalazzuk a szószt, és megszórjuk a reszelt sajttal.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(150) NOT NULL,
  `furnitures` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '\'[]\'',
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' CHECK (json_valid(`items`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `password`, `email`, `furnitures`, `items`) VALUES
(1, '$2a$08$qei8o6KorLAi4U0uqFzutOjz516VNoZe7Bu40TAJa0iJfiD.6TIse', 'pelda@email.com', '[{\"id\":\"furniture-1714596220559\",\"imgElement\":\"assets/szekreny4.png\",\"css\":\"width: 240px; height: 243px; border-color: black; left: 526px; top: 423px; filter: opacity(100%);\"},{\"id\":\"furniture-1714596226464\",\"imgElement\":\"assets/szekreny3.png\",\"css\":\"width: 164px; height: 243px; border-color: black; left: 0px; top: 423px; filter: opacity(100%);\"},{\"id\":\"furniture-1714596230456\",\"imgElement\":\"assets/suto5.png\",\"css\":\"width: 245px; height: 243px; border-color: black; left: 285.938px; top: 423px; filter: opacity(100%);\"},{\"id\":\"furniture-1714596241761\",\"imgElement\":\"assets/szekreny1.png\",\"css\":\"width: 115px; height: 243px; border-color: black; left: 167px; top: 423px; filter: opacity(100%);\"},{\"id\":\"furniture-1714596504264\",\"imgElement\":\"assets/szekreny_felso1.png\",\"css\":\"width: 250px; height: 202px; border-color: black; filter: opacity(100%); left: 512.547px; top: 0px;\"},{\"id\":\"furniture-1714596506353\",\"imgElement\":\"assets/szekreny_felso2.png\",\"css\":\"width: 265px; height: 202px; border-color: red; filter: opacity(100%); left: 0px; top: 0px;\"},{\"id\":\"furniture-1714596508048\",\"imgElement\":\"assets/szekreny_felso3.png\",\"css\":\"width: 205.594px; height: 203px; border-color: black; filter: opacity(100%); left: 766px; top: 0px;\"},{\"id\":\"furniture-1714596772009\",\"imgElement\":\"assets/huto2.png\",\"css\":\"width: 206px; height: 460px; border-color: black; left: 766px; top: 206px; filter: opacity(100%);\"},{\"id\":\"furniture-1714596825683\",\"imgElement\":\"assets/polc3.png\",\"css\":\"width: 241px; height: 80px; border-color: black; left: 268.547px; top: 122px; filter: opacity(100%);\"}]', '[{\"id\":\"furniture-1714596220559\",\"items\":[]},{\"id\":\"furniture-1714596226464\",\"items\":[]},{\"id\":\"furniture-1714596230456\",\"items\":[]},{\"id\":\"furniture-1714596241761\",\"items\":[]},{\"id\":\"furniture-1714596504264\",\"items\":[]},{\"id\":\"furniture-1714596506353\",\"items\":[]},{\"id\":\"furniture-1714596508048\",\"items\":[]},{\"id\":\"furniture-1714596772009\",\"items\":[]},{\"id\":\"furniture-1714596825683\",\"items\":[]}]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
