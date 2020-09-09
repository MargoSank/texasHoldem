import {main} from "./main";

it('main Hold em', () => {
    expect(main("2h3h4h5d8d 9hJh KdKs")).toStrictEqual("KdKs 9hJh");
});

it('main Hold em equal hands', () => {
    expect(main("4cKs4h8s7s Ad4s Ac4d As9s KhKd 5d6d")).toStrictEqual("Ac4d=Ad4s 5d6d As9s KhKd");
});

it('main Omaha', () => {
    expect(main("5cKs5h8s7s Ad4sAc4d As4hAh4c", true)).toStrictEqual("Ad4sAc4d=As4hAh4c");
});

describe("Texas hold 'em output data check", () => {

    it('Three fours, Ace-high flush, 8-high straight, Full house, kings full of fours', () => {
        expect(main("4cKs4h8s7s Ac4d As9s KhKd 5d6d")).toStrictEqual("Ac4d 5d6d As9s KhKd");
    });

    it(' two pair queens and eights ,two pair queens and king ', () => {
        expect(main("8sQc8h4c2d KhQs QhTd", false)).toStrictEqual("QhTd KhQs");
    });
});

describe("Omaha hold 'em output data check", () => {

    it('Spade flush', () => {
        expect(main("Ks9sQsQh5s Js2h4h5c 2s3sKdJd", true)).toStrictEqual("Js2h4h5c 2s3sKdJd");
    });

    it('Two pair on the board does not make a full house', () => {
        expect(main("JsJd9s5h9d As2sJhKd Jc2d9hTd Ts5c5s2c", true)).toStrictEqual("As2sJhKd Ts5c5s2c Jc2d9hTd");
    });
});
