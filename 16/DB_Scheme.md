```
- User Document
 - id: string
 - stripeId: string
 - familyName: string
 - firstName: string
 - familyNameKana: string
 - firstNameKana: string
 - birthDate: string(YYYY-MM-DD)
 - gender: string('MALE', 'FEMALE', 'OTHER')
 - phone: string
 - createdAt: string(ISO8601)
 - updatedAt: string(ISO8601)

- Shop Document
 - id: string
 - name: string
 - loginMail: string
 - mails: string[](4 つまで)
 - phone: string
 - openDate: string(YYYY-MM-DD)
 - endDate: string(YYYY-MM-DD)
 - openTime: string(HH:mm)
 - closedTime: string(HH:mm)
 - isOpened: boolean
 - createdAt: string(ISO8601) ex) 2019-09-18T12:15:27.565+09:00
 - updatedAt: string(ISO8601) ex) 2019-09-18T12:15:27.565+09:00

- Product Info Document（* 以外はユビレジ由来）
  - id: string
  - name: string
  - price: string(ex. '600.0')
  - priceType: string('intax')
  - vat: number
  - stock: number
  - *imageUrl: string
  - *productUrl: string
  - createdAt: string(ISO8601) ex)2019-09-18T12:15:27.565+09:00
  - updatedAt: string(ISO8601) ex)2019-09-18T12:15:27.565+09:00

- Order Document(注文 ID(YYYY-MM-DD-***) ごとに 1 ドキュメントを想定)
 - orderId: string(YYYY-MM-DD-***)
  - id: string
  - userId: string
  - shopId: string
  - info: OrderInfo[]
  - total: number
  - status: string('none'(初期値), 'stock'(在庫数を減らせた状態), 'payment'（在庫数を減らした上で支払いまで済んだ状態）)
  - createdAt: string(ISO8601) ex)2019-09-18T12:15:27.565+09:00

- Order Info Document
 - productId: string（ユビレジと合わせる）
 - unitPrice: number
 - amount: number
 - subTotal: number
 ```