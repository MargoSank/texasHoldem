import {compare, getCartValue, inputCheck} from "./main";

test('input validation (not enough characters)', () => {
    expect(inputCheck("4cKs4h8s7s")).toBe(false);
});

test('input validation (duplicates)', () => {
    expect(inputCheck("4cKs4h8s7s 4cKs4h8s7s")).toBe(false);
});

test('input validation (not duplicates)', () => {
    expect(inputCheck("4cKs4h8s7s Ad4s Ac4d As9s KhKd 5d6d")).toBe(false);
});

test('input validation (error in card designation)', () => {
    expect(inputCheck("2p3p4h5d8p 1dKs 0hJh")).toBe(false);
});

test('card evaluation check (A)', () => {
    expect(getCartValue("Ac")).toBe(14);
});

test('card evaluation check (K)', () => {
    expect(getCartValue("Kh")).toBe(13);
});

test('card evaluation check (Q)', () => {
    expect(getCartValue("Qd")).toBe(12);
});

test('card evaluation check (J)', () => {
    expect(getCartValue("Js")).toBe(11);
});

test('card evaluation check (T)', () => {
    expect(getCartValue("Th")).toBe(10);
});

test('card evaluation check (9)', () => {
    expect(getCartValue("9c")).toBe(9);
});

test('card evaluation check (2)', () => {
    expect(getCartValue("2d")).toBe(2);
});

test('Comparison check (Js, Ad => -1)', () => {
    expect(compare("Js","Ad")).toBe(-1);
});

test('Comparison check (As, Qd => 1)', () => {
    expect(compare("As","Qd")).toBe(1);
});

test('Comparison check (5s, 5d => 0)', () => {
    expect(compare("5c","5d")).toBe(0);
});

