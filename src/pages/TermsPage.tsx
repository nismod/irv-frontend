import { Link, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { AppLink, ExtLink } from '@/lib/nav';

import {
  ArticleContainer,
  ArticleContentContainer,
  ArticleParagraph,
  ArticleSection,
  ArticleSectionHeader,
  SubSectionHeader,
  SuperSectionHeader,
} from './ui/ArticleContainer';
import { HeadingBox, HeadingBoxText } from './ui/HeadingBox';
import { StyledTableContainer, TableSectionContainer } from './ui/TableContainer';

export const TermsPage = () => (
  <ArticleContainer>
    <HeadingBox>
      <HeadingBoxText>Terms and Policies</HeadingBoxText>
    </HeadingBox>
    <ArticleContentContainer>
      <ArticleSection>
        <ArticleParagraph>
          This page contains the following documents:
          <ul>
            <li>
              <Link href="#terms">Terms of Use</Link>
            </li>
            <li>
              <Link href="#privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="#cookie">Cookie Policy</Link>
            </li>
          </ul>
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection>
        <ArticleSectionHeader>Disclaimer</ArticleSectionHeader>

        <ArticleParagraph>
          This tool is provided for general information only and is not intended to amount to advice
          on which you should rely. You must obtain professional or specialist advice before taking,
          or refraining from, any action on the basis of the content on our site.
        </ArticleParagraph>

        <ArticleParagraph>
          Although we make reasonable efforts to update the information on our site, we make no
          representations, warranties or guarantees, whether express or implied, that the content on
          our site (including this tool) is accurate, complete or up to date. The University of
          Oxford accepts no liability in relation to any issues or liabilities that may subsequently
          arise from use of the data or this tool for any purpose. Please consult our{' '}
          <AppLink to="/terms-of-use">website terms of use</AppLink> for more information about our
          liability to you.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection>
        <ArticleParagraph>
          <Link id="terms" href="#terms">
            Link to Terms
          </Link>
        </ArticleParagraph>
        <SuperSectionHeader>Terms and conditions of website use</SuperSectionHeader>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>What's in these terms?</ArticleSectionHeader>
        <ArticleParagraph>
          These terms tell you the rules for using our website{' '}
          <ExtLink href="https://global.infrastructureresilience.org">
            https://global.infrastructureresilience.org
          </ExtLink>{' '}
          (our site).
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>Who we are and how to contact us</ArticleSectionHeader>
        <ArticleParagraph>
          Our site is operated by the University of Oxford, whose administrative offices are at
          Wellington Square, Oxford OX1 2JD.
        </ArticleParagraph>
        <ArticleParagraph>To contact us, please email tom.russell@ouce.ox.ac.uk.</ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>By using our site you accept these terms</ArticleSectionHeader>
        <ArticleParagraph>
          By using our site, you confirm that you accept these terms of use and that you agree to
          comply with them.
        </ArticleParagraph>
        <ArticleParagraph>
          If you do not agree to these terms, you must not use our site.
        </ArticleParagraph>
        <ArticleParagraph>
          We recommend that you print a copy of these terms for future reference.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>There are other terms that may apply to you</ArticleSectionHeader>
        <ArticleParagraph>
          These terms of use refer to the following additional terms, which also apply to your use
          of our site:
        </ArticleParagraph>
        <ArticleParagraph>
          <ul>
            <li>
              Our Privacy Policy (see below), which sets out the terms on which we process any
              personal data we collect from you, or that you provide to us. By using our site, you
              consent to such processing.
            </li>

            <li>
              Our Cookie Policy (see below), which sets out information about the cookies on our
              site.
            </li>
          </ul>
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>We may make changes to these terms</ArticleSectionHeader>
        <ArticleParagraph>
          We amend these terms from time to time. Every time you wish to use our site, please check
          these terms to ensure you understand the terms that apply at that time.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>We may make changes to our site</ArticleSectionHeader>
        <ArticleParagraph>
          We may update and change our site from time to time to ensure it is up to date.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>We may suspend or withdraw our site</ArticleSectionHeader>
        <ArticleParagraph>Our site is made available free of charge.</ArticleParagraph>
        <ArticleParagraph>
          We do not guarantee that our site, or any content on it, will always be available or be
          uninterrupted. We may suspend or withdraw or restrict the availability of all or any part
          of our site for business and operational reasons. We will try to give you reasonable
          notice of any suspension or withdrawal.
        </ArticleParagraph>
        <ArticleParagraph>
          You are also responsible for ensuring that all persons who access our site through your
          internet connection are aware of these terms of use and other applicable terms and
          conditions, and that they comply with them.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>You must keep your account details safe</ArticleSectionHeader>
        <ArticleParagraph>
          If you choose, or you are provided with, a user identification code, password or any other
          piece of information as part of our security procedures, you must treat such information
          as confidential. You must not disclose it to any third party.
        </ArticleParagraph>
        <ArticleParagraph>
          We have the right to disable any user identification code or password, whether chosen by
          you or allocated by us, at any time, if in our reasonable opinion you have failed to
          comply with any of the provisions of these terms of use.
        </ArticleParagraph>
        <ArticleParagraph>
          If you know or suspect that anyone other than you knows your user identification code or
          password, you must promptly notify us at the contact email address given above.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>How you may use material on our site</ArticleSectionHeader>
        <ArticleParagraph>
          The contents of our site are owned by us or, where content has been provided by third
          parties, by those third parties. The copyright in the material contained on our site
          belongs to us or our licensors. It is your responsibility to seek appropriate consent to
          re-use any contents of our site.{' '}
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>Do not rely on information on this site</ArticleSectionHeader>
        <ArticleParagraph>
          The content on our site is provided for general information only and is not intended to
          amount to advice on which you should rely. You must obtain professional or specialist
          advice before taking, or refraining from, any action on the basis of the content on our
          site.
        </ArticleParagraph>
        <ArticleParagraph>
          Although we make reasonable efforts to update the information on our site, we make no
          representations, warranties or guarantees, whether express or implied, that the content on
          our site is accurate, complete or up to date.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>
          We are not responsible for websites we link to or third party information
        </ArticleSectionHeader>
        <ArticleParagraph>
          Where our site contains links to other sites and resources provided by third parties,
          these links and resources are provided for your information only. Such links should not be
          interpreted as approval by us of those linked websites or information you may obtain from
          them.
        </ArticleParagraph>
        <ArticleParagraph>
          We have no control over the contents of those sites or resources.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>User-generated content is not approved by us</ArticleSectionHeader>
        <ArticleParagraph>
          This website may include information and materials uploaded by other users of the site.
          This information and these materials have not been verified or approved by us. The views
          expressed by other users on our site do not represent our views or values.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>
          Our responsibility for loss or damage suffered by you
        </ArticleSectionHeader>
        <ArticleParagraph>
          To the extent permitted in law, we accept no liability for any loss or damage which may be
          suffered by you or by other parties as a direct or indirect result of using our site
          (including loss of profit, loss of opportunity, loss of business, and consequential loss).
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>
          We are not responsible for viruses and you must not introduce them
        </ArticleSectionHeader>
        <ArticleParagraph>
          We do not guarantee that our site will be secure or free from bugs or viruses.
        </ArticleParagraph>
        <ArticleParagraph>
          You are responsible for configuring your information technology, computer programmes and
          platform to access our site. You should use your own virus protection software.
        </ArticleParagraph>
        <ArticleParagraph>
          You must not misuse our site by knowingly introducing viruses, trojans, worms, logic bombs
          or other material that is malicious or technologically harmful. You must not attempt to
          gain unauthorised access to our site, the server on which our site is stored or any
          server, computer or database connected to our site. You must not attack our site via a
          denial-of-service attack or a distributed denial-of service attack. By breaching this
          provision, you would commit a criminal offence under the Computer Misuse Act 1990. We will
          report any such breach to the relevant law enforcement authorities and we will co-operate
          with those authorities by disclosing your identity to them. In the event of such a breach,
          your right to use our site will cease immediately.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>Rules about linking to our site</ArticleSectionHeader>
        <ArticleParagraph>
          You may link to our home page, provided you do so in a way that is fair and legal and does
          not damage our reputation or take advantage of it.
        </ArticleParagraph>
        <ArticleParagraph>
          You must not establish a link in such a way as to suggest any form of association,
          approval or endorsement on our part where none exists.
        </ArticleParagraph>
        <ArticleParagraph>
          You must not establish a link to our site in any website that is not owned by you.
        </ArticleParagraph>
        <ArticleParagraph>
          Our site must not be framed on any other site, nor may you create a link to any part of
          our site other than the home page.
        </ArticleParagraph>
        <ArticleParagraph>
          We reserve the right to withdraw linking permission without notice.
        </ArticleParagraph>
        <ArticleParagraph>
          If you wish to link to or make any use of content on our site other than that set out
          above, please contact us using the email address given above.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>Which country's laws apply to any disputes?</ArticleSectionHeader>
        <ArticleParagraph>
          These terms of use, their subject matter and their formation (and any non-contractual
          disputes or claims) are governed by English law. We both agree to the exclusive
          jurisdiction of the courts of England and Wales.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection>
        <ArticleParagraph>
          <Link id="privacy" href="#privacy">
            Link to Privacy Policy
          </Link>
        </ArticleParagraph>
        <SuperSectionHeader>Privacy Policy</SuperSectionHeader>
        <ArticleParagraph>
          https://global.infrastructureresilience.org (“This site”) is operated by the University of
          Oxford. We are committed to protecting the privacy and security of your personal
          information ('personal data').
        </ArticleParagraph>
        <ArticleParagraph>
          This policy, together with our terms of use (see above) and together with any other
          documents referred to in it, describes how we collect and use your personal data during
          your use of our site, in accordance with the General Data Protection Regulation (GDPR) and
          associated data protection legislation.{' '}
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>Who is using your personal data?</ArticleSectionHeader>
        <ArticleParagraph>
          The University of Oxford1 is the “data controller" for the information that you provide to
          us when visiting this website. This means that we decide how to use it and are responsible
          for looking after it in accordance with the GDPR.{' '}
        </ArticleParagraph>
        <ArticleParagraph>
          Access to your personal data within the University will be provided to those staff who
          need to view it as part of their work in connection with the operation of this website.
        </ArticleParagraph>
        <ArticleParagraph>
          Please read the following carefully to understand our views and practices regarding your
          personal data and how we will treat it. We may update this policy at any time.
        </ArticleParagraph>
        <ArticleParagraph>
          By visiting our site you are accepting and consenting to the practices described in this
          policy.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>Glossary</ArticleSectionHeader>
        <ArticleParagraph>
          Where we refer in this policy to your 'personal data', we mean any recorded information
          that is about you and from which you can be identified. It does not include data where
          your identity has been removed (anonymous data).
        </ArticleParagraph>
        <ArticleParagraph>
          Where we refer to the 'processing' of your personal data, we mean anything that we do with
          that information, including collection, use, storage, disclosure or retention.{' '}
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>Types of data we collect about you</ArticleSectionHeader>
        <ArticleParagraph>
          We may collect, store, and use the following categories of data when you use our site:
        </ArticleParagraph>
        <SubSectionHeader>Data you give us.</SubSectionHeader>
        <ArticleParagraph>
          We do not collect or request any data directly from you.
        </ArticleParagraph>
        <SubSectionHeader>Data we collect about you automatically.</SubSectionHeader>
        <ArticleParagraph>
          If you visit our site, we will automatically collect certain technical information, for
          example, the type of device (and its unique device identifier) you use to access our site,
          the Internet protocol (IP) address used to connect your device to the Internet, browser
          type and version, operating system and platform.{' '}
        </ArticleParagraph>
        <ArticleParagraph>
          We will automatically collect information about your visit to our site including the full
          Uniform Resource Locators (URL), clickstream to, through and from the Website (including
          date and time), pages you viewed, response times, download errors, length of visits to
          certain pages, page interaction information (such as scrolling, clicks, and mouse-overs),
          and methods used to browse away from the page.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>When we collect your data</ArticleSectionHeader>
        <ArticleParagraph>
          When you visit our site we automatically collect a minimal amount of technical information
          about your visit.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>How we use your data</ArticleSectionHeader>
        <ArticleParagraph>
          We process your data for one or more of the following reasons:{' '}
        </ArticleParagraph>
        <ArticleParagraph>
          <ul>
            <li>
              For purposes arising from your use of this website, for example, to ensure that we
              understand how our site is used and to improve our site and ensure it is secure. This
              processing occurs because it is necessary to meet our legitimate interests in
              operating this website. Information processed for this purpose includes, but is not
              limited to IP address, URL, request headers and date and time of HTTP/S requests
            </li>
          </ul>
        </ArticleParagraph>
        <ArticleParagraph>
          We will only use your data for the purposes for which we collected it, unless we
          reasonably consider that we need to use it for another related reason and that reason is
          compatible with the original purpose. If we need to use your data for an unrelated
          purpose, we will seek your consent to use it for that new purpose.{' '}
        </ArticleParagraph>
        <ArticleParagraph>
          Please note that we may process your data without your knowledge or consent, in compliance
          with the above rules, where this is required or permitted by law.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>Sharing your data with third parties</ArticleSectionHeader>
        <ArticleParagraph>
          We may share your data with third parties who provide services on our behalf, such as
          those who help us to operate the website, or with Google through Google Analytics. All our
          third-party service providers are required to take appropriate security measures to
          protect your data in line with our policies. We do not allow them to use your data for
          their own purposes. We permit them to process your data only for specified purposes and in
          accordance with our instructions.
        </ArticleParagraph>
        <ArticleParagraph>
          We may also share your personal data with third parties if we are under a duty to disclose
          or share your personal data in order to comply with any legal obligation, or in order to
          enforce or apply our site terms of use or to protect the rights, property or safety of our
          site, our users, and others.
        </ArticleParagraph>
        <ArticleParagraph>
          Where your data is shared with third parties, we will seek to share the minimum amount
          necessary.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>Where we store or use your data</ArticleSectionHeader>
        <ArticleParagraph>
          We may store data collected by the website manually or electronically. The data is stored
          on our secure servers and/or in our premises within the UK.
        </ArticleParagraph>
        <ArticleParagraph>
          Unfortunately, the transmission of information via the internet is not completely secure.
          Although we will do our best to protect your personal data, we cannot guarantee the
          security of data transmitted to the website and any transmission is at your own risk.{' '}
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>Third party websites</ArticleSectionHeader>
        <ArticleParagraph>
          Our site contains links to and from various third party websites. If you follow a link to
          any of these websites, please note that these websites have their own privacy policies and
          that we do not accept any responsibility or liability for these policies.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>Retaining your data</ArticleSectionHeader>
        <ArticleParagraph>
          We will only retain your data for as long as we need it to fulfil our purposes, including
          any relating to legal, accounting, or reporting requirements.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>Your rights</ArticleSectionHeader>
        <ArticleParagraph>
          Under certain circumstances, by law you have the right to:
        </ArticleParagraph>
        <ArticleParagraph>
          <ul>
            <li>
              Request access to your data (commonly known as a "subject access request"). This
              enables you to receive a copy of your data and to check that we are lawfully
              processing it.
            </li>

            <li>
              Request correction of your data. This enables you to ask us to correct any incomplete
              or inaccurate information we hold about you.
            </li>

            <li>
              Request erasure of your data. This enables you to ask us to delete or remove your data
              where there is no good reason for us continuing to process it. You also have the right
              to ask us to delete or remove your data where you have exercised your right to object
              to processing (see below).
            </li>

            <li>
              Object to processing of your data where we are relying on our legitimate interests (or
              those of a third party) and there is something about your particular situation which
              makes you want to object to processing on this ground.
            </li>

            <li>
              Request the restriction of processing of your data. This enables you to ask us to
              suspend the processing of your data, for example if you want us to establish its
              accuracy or the reason for processing it.
            </li>

            <li>Request the transfer of your data to another party. </li>
          </ul>
        </ArticleParagraph>
        <ArticleParagraph>
          Depending on the circumstances and the nature of your request it may not be possible for
          us to do what you have asked, for example, where there is a statutory or contractual
          requirement for us to process your data and it would not be possible to fulfil our legal
          obligations if we were to stop. However, where you have consented to the processing (for
          example, where you have asked us to contact you for marketing purposes) you can withdraw
          your consent at any time by emailing us at the contact email address given above. In this
          event, we will stop the processing as soon as we can. However, this will not affect the
          lawfulness of any processing carried out before your withdrawal of consent and you may no
          longer be able to use the site in the same way as you did before.
        </ArticleParagraph>
        <ArticleParagraph>
          If you want to exercise any of the rights described above or are dissatisfied with the way
          we have used your information, you should contact the University's Information Compliance
          Team at
          <Link href="mailto:data.protection@admin.ox.ac.uk">data.protection@admin.ox.ac.uk</Link>.
          The same email address may be used to contact the University's Data Protection Officer. We
          will seek to deal with your request without undue delay, and in any event in accordance
          with the requirements of the GDPR. Please note that we may keep a record of your
          communications to help us resolve any issues which you raise.
        </ArticleParagraph>
        <ArticleParagraph>
          If you remain dissatisfied, you have the right to lodge a complaint with the Information
          Commissioner's Office at{' '}
          <ExtLink href="https://ico.org.uk/concerns/">https://ico.org.uk/concerns/</ExtLink>.{' '}
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>Cookies</ArticleSectionHeader>
        <ArticleParagraph>
          Our site uses cookies to distinguish you from other users of our site. This helps us to
          provide you with a good experience when you browse our site and also allows us to improve
          our site. For detailed information on the cookies we use and the purposes for which we use
          them see our Cookie policy, below.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>Changes to this policy</ArticleSectionHeader>
        <ArticleParagraph>
          Any changes we may make to our privacy policy in the future will be posted on this page.
          Please check back frequently to see any updates or changes to our privacy policy.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>Contact</ArticleSectionHeader>
        <ArticleParagraph>
          If you wish to raise any queries or concerns about this privacy policy please contact us
          at the contact email address given above or by post at University of Oxford, University
          Offices, Wellington Square, Oxford, OX1 2JD.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleParagraph>
          <Link id="cookie" href="#cookie">
            Link to Cookie Policy
          </Link>
        </ArticleParagraph>

        <SuperSectionHeader>Cookie Policy</SuperSectionHeader>
        <ArticleParagraph>
          This statement explains how we use cookies on the website. For information about what
          types of personal information will be gathered when you visit the website, and how this
          information will be used, please see our Privacy Policy.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>How we use cookies</ArticleSectionHeader>
        <ArticleParagraph>
          All of our web pages use "cookies". A cookie is a small file of letters and numbers that
          we place on your computer or mobile device if you agree. These cookies allow us to
          distinguish you from other users of our website, which helps us to provide you with a good
          experience when you browse our website and enables us to improve our website.
        </ArticleParagraph>
        <ArticleParagraph>We use the following types of cookies:</ArticleParagraph>
        <ArticleParagraph>
          <strong>strictly necessary cookies</strong> - these are essential in to enable you to move
          around the websites and use their features. Without these cookies the services you have
          asked for, such as registering for an account, cannot be provided.
        </ArticleParagraph>
        <ArticleParagraph>
          <strong>performance cookies</strong> - these cookies collect information about how
          visitors use a website, for instance which pages visitors go to most often. We use this
          information to improve our websites and to aid us in investigating problems raised by
          visitors. These cookies do not collect information that identifies a visitor.
        </ArticleParagraph>
        <ArticleParagraph>
          Most web browsers allow some control of most cookies through the browser settings. To find
          out more about cookies, including how to see what cookies have been set and how to manage
          and delete them please visit{' '}
          <ExtLink href="http://www.allaboutcookies.org/">http://www.allaboutcookies.org/</ExtLink>.
        </ArticleParagraph>
        <ArticleParagraph>
          Cookies may be set either by global.infrastructureresilience.org ("first party cookies"),
          or by a third party website ("third party cookies"). The tables below identifies the
          cookies we use and explains the purposes for which they are used.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <SubSectionHeader>First Party Cookies</SubSectionHeader>
        <ArticleParagraph>
          These cookies are used to collect information about how visitors use our site. We use the
          information to compile reports and to help us improve the website. The cookies collect
          information in an anonymous form, including the number of visitors to the website, where
          visitors have come to the site from and the pages they visited.
        </ArticleParagraph>

        <ArticleParagraph>
          Google provide an{' '}
          <ExtLink href="http://www.google.co.uk/intl/en/analytics/privacyoverview.html">
            overview of Google Analytics privacy
          </ExtLink>{' '}
          for reference.
        </ArticleParagraph>
      </ArticleSection>
      <TableSectionContainer>
        <StyledTableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Provider</TableCell>
                <TableCell>Cookie name</TableCell>
                <TableCell>Default expiration time</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell rowSpan={2}>Google Analytics</TableCell>
                <TableCell>_ga</TableCell>
                <TableCell>2 years</TableCell>
                <TableCell>Used to distinguish users.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>_ga_G-932WHK2NN6</TableCell>
                <TableCell>2 years</TableCell>
                <TableCell>Used to persist session state.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </StyledTableContainer>
      </TableSectionContainer>
      <ArticleSection>
        <ArticleSectionHeader>Changes to our Cookie Statement</ArticleSectionHeader>
        <ArticleParagraph>
          Any changes we may make to our Cookie Statement in the future will be posted on this page.
        </ArticleParagraph>
      </ArticleSection>
      <ArticleSection>
        <ArticleSectionHeader>Contact</ArticleSectionHeader>
        <ArticleParagraph>
          Any queries or concerns about the use of cookies on this website should be sent by email
          to{' '}
          <Link href="mailto:data.protection@admin.ox.ac.uk">data.protection@admin.ox.ac.uk</Link>{' '}
          or addressed to the Data Protection Office, University of Oxford, University Offices,
          Wellington Square, Oxford, OX1 2JD.
        </ArticleParagraph>
      </ArticleSection>
    </ArticleContentContainer>
  </ArticleContainer>
);
