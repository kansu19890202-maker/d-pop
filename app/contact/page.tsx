import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { CONTACT_MAILTO } from "@/lib/contact";

export const metadata: Metadata = {
  title: "お問い合わせ・権利侵害に関するお申し立て | D-POP",
};

export default function ContactPage() {
  return (
    <LegalPage title="お問い合わせ・権利侵害に関するお申し立て">
      <p>
        本サイト（D-POP）は、ダーツファン同士の交流とデザインの参考を目的とした、ユーザー投稿型の画像共有プラットフォームです。
        運営においては、著作権、肖像権、パブリシティ権、商標権などの知的財産権を尊重し、第三者の権利を侵害しないよう利用規約にてユーザーに定めております。
      </p>

      <LegalSection title="権利者様へのご案内（削除要請について）">
        <p>
          万が一、当サイトに掲載されているコンテンツの中に、権利者様（選手ご本人様、所属事務所様、メーカー様、イベント主催者様など）の許諾を得ていない無断転載画像や、ブランドイメージを損なう不適切な画像がございましたら、大変お手数ですが下記の窓口よりご連絡をお願いいたします。
        </p>
        <p>
          権利者様ご本人（または正当な代理人様）からのご申告であることを確認次第、理由の如何を問わず、速やかに該当コンテンツの削除または非表示対応を行わせていただきます。
        </p>
      </LegalSection>

      <LegalSection title="お問い合わせ窓口">
        <p>
          削除のご依頼、その他当サイトに関するお問い合わせは、以下のボタンからメールにてお願いいたします。
        </p>
        <p>
          <a
            href={CONTACT_MAILTO}
            className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200"
          >
            メールでお問い合わせ・削除依頼を送る
          </a>
        </p>
        <p className="text-zinc-500">
          ※ご依頼の際は、該当する画像のURL（またはタイトル）、および権利者様であることを確認できる情報をご記載いただけますと、より迅速な対応が可能です。
        </p>
      </LegalSection>
    </LegalPage>
  );
}
