/**
 * This is an example of how to create a template that makes use of streams data.
 * The stream data originates from Yext's Knowledge Graph. When a template in
 * concert with a stream is built by the Yext Pages system, a static html page
 * is generated for every corresponding (based on the filter) stream document.
 *
 * Another way to think about it is that a page will be generated using this
 * template for every eligible entity in your Knowledge Graph.
 */

import * as React from 'react';
import {
	GetHeadConfig,
	GetPath,
	GetRedirects,
	HeadConfig,
	Template,
	TemplateConfig,
	TemplateProps,
	TemplateRenderProps,
	TransformProps,
} from '@yext/pages';
import '../index.css';
import Favicon from '../assets/images/yext-favicon.ico';
import About from '../components/About';
import { Banner } from '../components/Location/Banner';
import Details from '../components/Details';
import Hours from '../components/Hours';
import PageLayout from '../components/PageLayout';
import BreadCrumbs from '../components/Breadcrumbs';
import Cta from '../components/Cta';
import { Image } from '@yext/pages/components';
import Brands from '../components/Location/ImageCard';
import Content from '../components/Location/Content';
import Faqs from '../components/Location/Faqs';
import Apis from '../utils/Apis';
import { getDirection } from '../utils/helper';

/**
 * Required when Knowledge Graph data is used for a template.
 */
export const config: TemplateConfig = {
	stream: {
		$id: 'location-stream',
		// Defines the scope of entities that qualify for this stream.
		// You can use entityTypes, savedFilterIds, and/or entityIds

		// Specifies the exact data that each generated document will contain.
		// This data is passed in directly as props to the default exported function.
		fields: [
			'id',
			'uid',
			'meta',
			'name',
			'address',
			'mainPhone',
			'description',
			'hours',
			'slug',
			'geocodedCoordinate',
			'services',
			'photoGallery',
			'dm_directoryParents.name',
			'dm_directoryParents.slug',
			'dm_directoryParents.meta',
			'dm_directoryParents.c_addressRegionDisplayName',
			'dm_directoryChildren.slug',
			'c_cTALendingTree',
			'c_cTACreditKarma',
			'c_cTABestCompany',
			'c_cTATrustPilot',
			'c_branchManager',
			'fax',
			'c_pagesAboutDescription',
			'c_disclosureNew',
			'c_fAQQuestion1',
			'c_fAQAnswer1',
			'c_fAQQuestion2',
			'c_fAQAnswer2',
			'c_fAQQuestion3',
			'c_fAQAnswer3',
			'c_fAQQuestion4',
			'c_fAQAnswer4',
			'c_fAQQuestion5',
			'c_fAQAnswer5',
			'c_alertBannerText',
			'c_startLoanProcessURL',
			'c_concernsAndComplaintsURL',
			'c_consumerInformationBrochureURL',
			'c_ratesAndFeesDisclosureURL',
			'c_viewLicenseURL',
		],
		filter: {
			entityTypes: ['location'],
		},
		// The entity language profiles that documents will be generated for.
		localization: {
			locales: ['en'],
			primary: false,
		},
		transform: {
			replaceOptionValuesWithDisplayNames: ['paymentOptions'],
		},
	},
};

/**
 * Defines the path that the generated file will live at for production.
 *
 * NOTE: To preview production URLs locally, you must return document.slug from this function
 * and ensure that each entity has the slug field pouplated.
 */
export const getPath: GetPath<TemplateProps> = ({ document }) => {
	return document.slug
		? document.slug
		: `${document.locale}/${document.address.region}/${document.address.city}/${
				document.address.line1
		  }-${document.id.toString()}`;
};

/**
 * Defines a list of paths which will redirect to the path created by getPath.
 *
 * NOTE: This currently has no impact on the local dev path. Redirects will be setup on
 * a new deploy.
 */
export const getRedirects: GetRedirects<TemplateProps> = ({ document }) => {
	return [`index-old/${document.locale}/${document.id.toString()}`];
};

/**
 * This allows the user to define a function which will take in their template
 * data and produce a HeadConfig object. When the site is generated, the HeadConfig
 * will be used to generate the inner contents of the HTML document's <head> tag.
 * This can include the title, meta tags, script tags, etc.
 */
export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
	document,
}): HeadConfig => {
	return {
		title: document.name,
		charset: 'UTF-8',
		viewport: 'width=device-width, initial-scale=1',
		tags: [
			{
				type: 'meta',
				attributes: {
					name: 'description',
					content: document.description,
				},
			},
			{
				type: 'link',
				attributes: {
					rel: 'icon',
					type: 'image/x-icon',
					href: Favicon,
				},
			},
		],
	};
};

/**
 * Required only when data needs to be retrieved from an external (non-Knowledge Graph) source.
 * If the page is truly static this function is not necessary.
 *
 * This function will be run during generation and pass in directly as props to the default
 * exported function.
 */
export const transformProps: TransformProps<any> = async (data) => {
	const { dm_directoryParents, name, slug } = data?.document;

	const faqs = [
		{
			id: 0,
			question: data?.document.c_fAQQuestion1 || '',
			answer: data?.document.c_fAQAnswer1 || '',
		},
		{
			id: 1,
			question: data?.document.c_fAQQuestion2 || '',
			answer: data?.document.c_fAQAnswer2 || '',
		},
		{
			id: 2,
			question: data?.document.c_fAQQuestion3 || '',
			answer: data?.document.c_fAQAnswer3 || '',
		},
		{
			id: 3,
			question: data?.document.c_fAQQuestion4 || '',
			answer: data?.document.c_fAQAnswer4 || '',
		},
		{
			id: 4,
			question: data?.document.c_fAQQuestion5 || '',
			answer: data?.document.c_fAQAnswer5 || '',
		},
	];

	(dm_directoryParents || []).push({ name: slug, slug: name });

	return {
		...data,
		document: {
			...data.document,
			dm_directoryParents: dm_directoryParents,
			faqs: faqs,
		},
	};
};

const Location: Template<TemplateRenderProps> = ({
	relativePrefixToRoot,
	document,
}) => {
	const {
		name,
		slug,
		address,
		hours,
		mainPhone,
		services,
		description,
		siteDomain,
		_site,
		dm_directoryParents,
		c_concernsAndComplaintsURL,
		c_consumerInformationBrochureURL,
		c_ratesAndFeesDisclosureURL,
		c_viewLicenseURL,
		faqs,
	} = document;

	return (
		<>
			<PageLayout content={document?.c_alertBannerText}>
				<div className='grid grid-cols-1 md:p-3 p-4 small:p-2 lg:pl-0 xl:p-6 gap-2 md:grid-cols-2 bg-bg h-max  lg:grid-cols-2 '>
					<div
						className=' py-10 mt-[40px] w-lg m-auto
					xl:ml-[1.5rem] xl:mr-[8rem] 
					lg:pl-[2.8rem]
					large:mx-[9rem] large:pl-[1.2rem]
					extraLarge:ml-[7.9rem] extraLarge:mr-[8rem] '>
						<BreadCrumbs
							breadcrumbs={dm_directoryParents}
							baseUrl={relativePrefixToRoot}
							className='leading-none '
						/>
						<br />
						<h1 className='lg:text-[3rem]  text-[28px] text-typography-link font-bold md:mb-1 mb-3 leading-none'>
							{address?.city}
						</h1>
						<br />
						<div className='flex items-center gap-4 mb-[2.75rem] md:mb-6 '>
							<Cta
								buttonText='Get Direction'
								url='#'
								action={() =>
									getDirection(
										document?.geocodedCoordinate?.latitude,
										document?.geocodedCoordinate?.longitude
									)
								}
								style='text-white text-xs shadow-sm rounded-[5px] bg-primary text-center w-max-content lg:w-[183px] '
							/>
							<Cta
								buttonText='Start Loan Process'
								url={document?.c_startLoanProcessURL}
								style='text-white  text-xs shadow-sm bg-secondary text-center  rounded-[5px] lg:w-[183px]'
							/>
						</div>
						{/* horizontal line */}
						<div className='border-t-[0.5px] w-[290px] lg:w-[392px] max-w[100%] border-typography-line' />
						{/* content of hours and branch */}
						<div className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1  py-5 md:w-[370px] lg:w-[450px] md:gap-3 lg:gap-x-0   '>
							<Content document={document} />
							{hours && (
								<Hours
									title={'Restaurant Hours'}
									hours={hours}
								/>
							)}
						</div>
					</div>

					<div>
						<img
							src='https://gruffy-goat.b-cdn.net/Screenshot%202023-08-24%20at%208.25%201.png'
							height={610}
						/>
					</div>
				</div>

				{/* Image Card  */}
				<Brands document={document} />
				{/* Image Content section */}
				<div className='grid grid-cols-1 lg:grid-cols-2 bg-bg h-max'>
					<img
						src='https://gruffy-goat.b-cdn.net/Mask%20Group.jpg'
						className='large:w-[800px] w-[760px] extraLarge:w-[900px]'
						style={{
							height: '100%',
							objectFit: 'cover',
							overflow: 'hidden',
						}}
						alt='Your Alt Text'
					/>
					<div
						className='py-10 px-6 mt-[40px]  lg:pl-[4rem] lg:px-0 large:pl-[2rem]  
					2xl:px-0 xl:px-[4rem] xl:w-[76%] lg:mr-0  xl:mr-[6rem]  lg:w-[80%] large:w-[60%] extraLarge:w-[50%] extraLarge:pl-[2rem]'>
						<div className='text-xl text-typography-link lg:text-[32px] font-bold'>
							Regional Finance: your personal loan partner
						</div>
						<br />
						<p className='mb-5 text-lg text-gray-400'>
							{document.c_pagesAboutDescription}
						</p>
						<div className=' flex gap-2 flex-wrap mb-5 '>
							{c_consumerInformationBrochureURL && (
								<span
									className='text-typography-breadcrumb   underline underline-offset-1 cursor-pointer '
									style={{
										fontSize: 14,
									}}
									onClick={() =>
										window.open(c_consumerInformationBrochureURL, '_blank')
									}>
									Consumer Information Brochure
								</span>
							)}

							{c_concernsAndComplaintsURL && (
								<span
									className='text-typography-breadcrumb text-md underline underline-offset-1 cursor-pointer '
									style={{
										fontSize: 14,
									}}
									onClick={() =>
										window.open(c_concernsAndComplaintsURL, '_blank')
									}>
									Concerns & Complaints
								</span>
							)}
							{c_ratesAndFeesDisclosureURL && (
								<span
									className='text-typography-breadcrumb  text-md underline underline-offset-1 cursor-pointer '
									style={{
										fontSize: 14,
									}}
									onClick={() =>
										window.open(c_ratesAndFeesDisclosureURL, '_blank')
									}>
									Rates & Fees
								</span>
							)}
							{c_viewLicenseURL && (
								<span
									className='text-typography-breadcrumb text-md underline underline-offset-1 cursor-pointer '
									style={{
										fontSize: 14,
									}}
									onClick={() => window.open(c_viewLicenseURL, '_blank')}>
									View License
								</span>
							)}

							<span
								className='text-typography-breadcrumb text-md underline underline-offset-1 cursor-pointer '
								style={{
									fontSize: 14,
								}}
								onClick={() =>
									window.open('https://regionalfinance.com/', '_blank')
								}>
								RegionalFinance.com
							</span>
						</div>
						<div className='flex gap-2 flex-wrap mb-5'>{/* Your spans */}</div>
						<div className='text-gray-400 text-[12px] text-justify'>
							{document.c_disclosureNew}
						</div>
					</div>
				</div>

				{/* Faqs section */}
				<div className='flex flex-col items-center my-[5rem]'>
					<div className=' text-[32px] text-typography-link  text-center lg:text-[28px] mb-10 font-bold '>
						Frequently asked questions
					</div>
					{faqs.map((faq, index) => (
						<div
							key={index}
							className='mb-4'>
							<Faqs
								question={faq?.question}
								answer={faq?.answer}
							/>
						</div>
					))}
					<br />
				</div>
			</PageLayout>
		</>
	);
};

export default Location;
