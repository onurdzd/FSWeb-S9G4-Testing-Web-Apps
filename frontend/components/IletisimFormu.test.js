import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";
import App from "../App";

test("hata olmadan render ediliyor", () => {
  render(<App />);
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);

  const element = screen.getByTestId("iletisimFormuH1");
  expect(element).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const kullaniciAdi = await screen.findByTestId("iletisimFormuInput");
  userEvent.type(kullaniciAdi, "Onur");
  const hata = await screen.findByTestId("error");
  expect(hata).toBeInTheDocument();
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const gonderButton = await screen.findByTestId("iletisimFormuGonder");
  userEvent.click(gonderButton);
  const errors = screen.queryAllByTestId("error");
  expect(errors).toHaveLength(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const kullaniciAdi = await screen.findByTestId("iletisimFormuInput");
  userEvent.type(kullaniciAdi, "Onure");
  const kullaniciSoyadi = await screen.findByTestId("iletisimFormuInput2");
  userEvent.type(kullaniciSoyadi, "dizdar");
  const gonderButton = await screen.findByTestId("iletisimFormuGonder");
  userEvent.click(gonderButton);
  const errors = screen.queryAllByTestId("error");
  expect(errors).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const email = await screen.findByTestId("iletisimFormuInput3");
  userEvent.type(email, "dizdar");
  const errors = screen.getByText(
    "Hata: email geçerli bir email adresi olmalıdır."
  );
  expect(errors).toBeInTheDocument();
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const kullaniciAdi = await screen.findByTestId("iletisimFormuInput");
  userEvent.type(kullaniciAdi, "Onure");
  const email = await screen.findByTestId("iletisimFormuInput3");
  userEvent.type(email, "dizdar@gmail.com");
  const gonderButton = await screen.findByTestId("iletisimFormuGonder");
  userEvent.click(gonderButton);
  const errors = await screen.findAllByTestId("error");
  expect(errors).toHaveLength(1);
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  const kullaniciAdi = await screen.findByTestId("iletisimFormuInput");
  userEvent.type(kullaniciAdi, "Onure");
  const kullaniciSoyadi = await screen.findByTestId("iletisimFormuInput2");
  userEvent.type(kullaniciSoyadi, "dizdar");
  const email = await screen.findByTestId("iletisimFormuInput3");
  userEvent.type(email, "dizdar@gmail.com");
  const gonderButton = await screen.findByTestId("iletisimFormuGonder");
  userEvent.click(gonderButton);
  const errors = screen.queryAllByTestId("error");
  expect(errors).toHaveLength(0);
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);
  const kullaniciAdi = await screen.findByTestId("iletisimFormuInput");
  userEvent.type(kullaniciAdi, "Onure");
  const kullaniciSoyadi = await screen.findByTestId("iletisimFormuInput2");
  userEvent.type(kullaniciSoyadi, "dizdar");
  const email = await screen.findByTestId("iletisimFormuInput3");
  userEvent.type(email, "dizdar@gmail.com");
  const mesaj = await screen.findByTestId("iletisimFormuInput4");
  userEvent.type(mesaj, "mesaj yazıldı");
  const gonderButton = await screen.findByTestId("iletisimFormuGonder");
  userEvent.click(gonderButton);

  const nameTextArea = await screen.findByDisplayValue("Onure");
  const surNameTextArea = await screen.findByDisplayValue("dizdar");
  const mailTextArea = await screen.findByDisplayValue("dizdar@gmail.com");
  const mesajTextArea = await screen.findByDisplayValue("mesaj yazıldı");

  expect(nameTextArea).toBeInTheDocument();
  expect(surNameTextArea).toBeInTheDocument();
  expect(mailTextArea).toBeInTheDocument();
  expect(mesajTextArea).toBeInTheDocument();
});
