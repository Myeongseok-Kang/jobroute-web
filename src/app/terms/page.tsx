import Link from "next/link";

export const metadata = {
  title: "이용약관 | JobRoute",
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

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
        이용약관
      </h1>
      <p className="mt-2 text-sm text-ink-400">시행일: 2026년 6월 26일</p>

      <Section title="제1조 (목적)">
        <p>
          본 약관은 JobRoute(이하 “서비스”)의 이용 조건과 절차, 이용자와 서비스
          운영자의 권리·의무 및 책임사항을 규정합니다. JobRoute는 수익을 창출하지
          않는 비영리 포트폴리오 프로젝트입니다.
        </p>
      </Section>

      <Section title="제2조 (서비스 내용)">
        <p>
          서비스는 외부에 공개된 IT 채용 공고를 모아 보여주고, 이용자가 입력한
          텍스트·조건·이력서를 바탕으로 AI 기반 공고 매칭, 자기소개서 초안·첨삭,
          예상 면접 질문 생성, 맞춤 공고 이메일 알림 등의 기능을 제공합니다.
        </p>
        <p>
          서비스는 학습·포트폴리오 목적으로 운영되며, 사전 고지 없이 기능이
          변경되거나 중단될 수 있습니다.
        </p>
      </Section>

      <Section title="제3조 (회원가입 및 계정)">
        <p>
          이용자는 이메일·비밀번호 또는 소셜 로그인(구글, 카카오)으로 가입할 수
          있습니다. 계정 정보의 관리 책임은 이용자에게 있으며, 본인의 계정으로
          발생한 활동에 대한 책임은 이용자가 부담합니다.
        </p>
        <p>
          이용자는 언제든지 마이페이지에서 회원 탈퇴할 수 있으며, 탈퇴 시 관련
          데이터는 즉시 삭제됩니다.
        </p>
      </Section>

      <Section title="제4조 (금지 행위)">
        <p>다음 행위를 금지합니다.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>자동화 수단을 이용한 과도한 요청 등 서비스 운영을 방해하는 행위</li>
          <li>타인의 정보를 도용하거나 허위 정보를 입력하는 행위</li>
          <li>서비스 또는 제3자의 권리를 침해하는 행위</li>
        </ul>
      </Section>

      <Section title="제5조 (공고 정보 및 책임의 한계)">
        <p>
          서비스가 제공하는 채용 공고는 원티드·사람인·잡코리아 등 외부 출처에서
          수집된 공개 정보이며, 그 정확성·최신성·적법성을 보장하지 않습니다. 실제
          지원·채용 절차와 결과는 각 채용 사이트 및 기업의 책임 아래 진행됩니다.
        </p>
        <p>
          AI가 생성한 매칭 결과·자기소개서·면접 질문은 참고용이며, 정확성이나
          합격을 보장하지 않습니다. 이용자는 이를 참고 자료로만 활용해야 합니다.
        </p>
        <p>
          서비스는 비영리·포트폴리오 목적으로 “있는 그대로” 제공되며, 운영자는
          관련 법령이 허용하는 범위에서 서비스 이용으로 발생한 손해에 대해 책임을
          지지 않습니다.
        </p>
      </Section>

      <Section title="제6조 (지식재산권)">
        <p>
          채용 공고 원문의 권리는 각 출처 및 게시 기업에 있습니다. 이용자가 입력한
          이력서·자기소개서 등의 권리는 이용자에게 있으며, 서비스는 기능 제공
          목적으로만 이를 이용합니다.
        </p>
      </Section>

      <Section title="제7조 (약관의 변경)">
        <p>
          본 약관은 필요 시 개정될 수 있으며, 변경 시 서비스 내 공지합니다.
          변경된 약관은 공지된 시점부터 효력이 발생합니다.
        </p>
      </Section>

      <Section title="제8조 (준거법)">
        <p>
          본 약관은 대한민국 법령에 따라 해석되며, 서비스 이용과 관련한 분쟁에는
          대한민국 법을 적용합니다.
        </p>
      </Section>

      <Section title="문의">
        <p>서비스 관련 문의: dooly6276@gmail.com</p>
      </Section>

      <p className="mt-10 text-sm">
        <Link href="/privacy" className="font-semibold text-brand-600 hover:text-brand-700">
          개인정보처리방침 보기 →
        </Link>
      </p>
    </div>
  );
}
