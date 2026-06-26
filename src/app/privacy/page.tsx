import Link from "next/link";

export const metadata = {
  title: "개인정보처리방침 | JobRoute",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-ink-900">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-ink-600">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
        개인정보처리방침
      </h1>
      <p className="mt-2 text-sm text-ink-400">시행일: 2026년 6월 26일</p>

      <Section title="1. 개요">
        <p>
          JobRoute(이하 “서비스”)는 수익을 창출하지 않는 비영리 포트폴리오
          프로젝트로서, 서비스 제공에 필요한 최소한의 개인정보를 수집·이용합니다.
        </p>
      </Section>

      <Section title="2. 수집하는 개인정보 항목">
        <ul className="list-disc space-y-1 pl-5">
          <li>회원가입: 이메일, 비밀번호(해시 저장), 이름</li>
          <li>
            소셜 로그인(구글·카카오): 이메일, 이름, 프로필 사진, 소셜 식별자
          </li>
          <li>서비스 이용: 이력서 내용, 매칭·자소서·면접 생성 시 입력한 텍스트</li>
          <li>활동 정보: 매칭 이력, 북마크, 알림 설정</li>
        </ul>
      </Section>

      <Section title="3. 개인정보의 이용 목적">
        <ul className="list-disc space-y-1 pl-5">
          <li>회원 식별 및 로그인</li>
          <li>AI 공고 매칭, 자기소개서 초안·첨삭, 면접 질문 생성 기능 제공</li>
          <li>이력서 기반 맞춤 공고 이메일 알림 발송</li>
        </ul>
      </Section>

      <Section title="4. 제3자 처리 위탁 및 국외 이전">
        <p>
          AI 기능 제공을 위해 이용자가 입력한 텍스트(이력서·자기소개서·매칭 입력
          등)는 처리 과정에서 아래 외부 서비스로 전송될 수 있습니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>OpenAI — 자기소개서·면접 질문·매칭 사유 생성</li>
          <li>Voyage AI — 텍스트 임베딩(의미 검색)</li>
          <li>Google(Gmail) — 알림·비밀번호 재설정 이메일 발송</li>
        </ul>
        <p>
          채용 공고는 외부 채용 사이트의 공개 정보를 수집한 것으로, 개인정보가
          아닌 공개 게시물에 해당합니다.
        </p>
      </Section>

      <Section title="5. 보유 및 이용 기간">
        <p>
          개인정보는 회원 탈퇴 시까지 보유하며, 탈퇴 시 이력서·북마크·매칭
          이력·알림 설정 등 관련 데이터가 즉시 삭제됩니다.
        </p>
      </Section>

      <Section title="6. 이용자의 권리">
        <p>
          이용자는 언제든지 마이페이지에서 본인의 정보를 열람·수정하거나 회원
          탈퇴를 통해 삭제를 요청할 수 있습니다.
        </p>
      </Section>

      <Section title="7. 개인정보의 안전성 확보">
        <p>
          비밀번호는 복호화가 불가능한 방식(bcrypt 해시)으로 저장하며, 인증
          토큰(JWT) 기반으로 접근을 제어합니다.
        </p>
      </Section>

      <Section title="8. 문의처">
        <p>개인정보 관련 문의: dooly6276@gmail.com</p>
      </Section>

      <p className="mt-10 text-sm">
        <Link href="/terms" className="font-semibold text-brand-600 hover:text-brand-700">
          이용약관 보기 →
        </Link>
      </p>
    </div>
  );
}
