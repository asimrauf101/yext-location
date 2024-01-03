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
import { isProduction } from '@yext/pages/util';
import '../index.css';
import Favicon from '../assets/images/yext-favicon.ico';
import Banner from '../components/Banner';
import DirectoryStateGrid from '../components/DirectoryStateGrid';
import PageLayout from '../components/PageLayout';
import EditTool from '../components/EditTool';
import Breadcrumbs from '../components/Breadcrumbs';
import Apis from '../utils/Apis';
import Loader from '../components/Loader';
// import Map from '../components/Map';

const Map = React.lazy(() => import('../components/Map'));

export const config: TemplateConfig = {
	stream: {
		$id: 'state-stream',
		filter: {
			savedFilterIds: ['dm_directory_address_region'],
		},
		fields: [
			'id',
			'uid',
			'meta',
			'name',
			'description',
			'slug',
			'c_addressRegionDisplayName',
			'dm_directoryParents.name',
			'dm_directoryParents.slug',
			'dm_directoryParents.meta',
			'dm_directoryChildren.name',
			'dm_directoryChildren.slug',
			'dm_directoryChildren.dm_childEntityIds',
			'dm_childEntityIds',
		],
		localization: {
			locales: ['en'],
			primary: false,
		},
	},
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
	return `${document.slug.toString()}`;
};

export const getRedirects: GetRedirects<TemplateProps> = ({ document }) => {
	return [`alias/${document.locale}/${document.id.toString()}`];
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
	document,
}): HeadConfig => {
	return {
		title: document.name,
		charset: 'UTF-8',
		viewport: 'width=device-width, initial-scale=1',
		tags: [
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

export const transformProps: TransformProps<any> = async (data) => {
	const { dm_directoryParents, name } = data.document;

	(dm_directoryParents || []).push({ name: name, slug: '' });
	return {
		...data,
		document: {
			...data?.document,
			dm_directoryParents: dm_directoryParents,
		},
	};
};

const State: Template<TemplateRenderProps> = ({
	relativePrefixToRoot,
	document,
}) => {
	const {
		name,
		description,
		siteDomain,
		c_addressRegionDisplayName,
		dm_directoryParents,
		dm_directoryChildren,
	} = document;
	const [children, setChildren] = React.useState([]);
	const [data, setData] = React.useState([]);

	const [loading, setLoading] = React.useState(true);

	const getStatesInfo = async () => {
		try {
			const response = await Apis.getStatesInfo(name.toLowerCase());

			setData(response.entities);

			if (response.pageToken) {
				const response1 = await Apis.getStatesInfo(name.toLowerCase(), 50);

				setData((prevData) => [...prevData, ...response1.entities]);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	const transformData = () => {
		const newArray = dm_directoryChildren.map((obj) => {
			const matchingName = data.find((res) => res.address.city === obj.name);
			return {
				...obj,
				designation: matchingName ? matchingName.slug : '',
			};
		});

		setChildren(newArray);
		setLoading(false);
	};

	React.useEffect(() => {
		if (name) {
			getStatesInfo();
		}
	}, [name]);

	React.useEffect(() => {
		transformData();
	}, [data]);
	return (
		<>
			<PageLayout>
				{loading ? (
					<Loader />
				) : (
					<>
						<div className='grid grid-cols-1 xl:p-8 gap-2 md:grid-cols-2 bg-bg h-max lg:grid-cols-2 '>
							<div
								className=' xl:py-10 xl:p-0 p-4 md:p-4 flex flex-col  justify-center
					lg:p-4 lg:pl-[2.8rem]  
					xl:ml-[2rem] 2xl:mr[8rem]
					2xl:ml-[5rem] 2xl:mr[8rem] 2xl:p-0
					large:pl-[4.5rem]
					extraLarge:pl-[3.5rem]
					 '>
								<Breadcrumbs
									breadcrumbs={
										c_addressRegionDisplayName == 'Idaho'
											? dm_directoryParents
											: dm_directoryParents
									}
									baseUrl={relativePrefixToRoot}
									className='leading-none'
								/>
								<h1 className='text-[28px] lg:text-[3rem] text-typography-link font-bold mb-3 leading-none'>
									{c_addressRegionDisplayName == 'Idaho'
										? 'Browse All Regional Finance Branches and Service Areas in' +
										  ' ' +
										  c_addressRegionDisplayName
										: 'Browse All Regional Finance Branches' +
										  ' ' +
										  c_addressRegionDisplayName}
								</h1>
								{name && (
									<div>
										<DirectoryStateGrid
											name={
												c_addressRegionDisplayName
													? c_addressRegionDisplayName
													: name
											}
											description={description}
											directoryChildren={
												c_addressRegionDisplayName == 'Idaho'
													? children.slice(0, 1)
													: children
											}
											relativePrefixToRoot={relativePrefixToRoot}
										/>
									</div>
								)}
								{c_addressRegionDisplayName == 'Idaho' && (
									<div className='mt-[3rem]'>
										<h1 className='text-[18px] lg:text-[32px] text-typography-link font-bold mt-8 mb-3 leading-none'>
											Service Areas
										</h1>
										{/* <DirectoryStateGrid
											name={
												c_addressRegionDisplayName
													? c_addressRegionDisplayName
													: name
											}
											description={description}
											directoryChildren={children.slice(1)}
											relativePrefixToRoot={relativePrefixToRoot}
										/> */}
										<div className='grid  grid-cols-2 w-max max-w-lg mt-8   lg:grid-cols-2 xl:grid-cols-3 md:gap-x-2  md:grid-cols-3 gap-6  small:gap-x-[1.5rem] small:gap-y-[1rem]   xl:gap-x-[12rem] leading-[21.78px]'>
											{children.slice(1).map((child) => (
												<div
													key={child.slug}
													className='w-max'>
													<a
														key='uRL'
														href={relativePrefixToRoot + child.designation}
														className='font-semibold text-[18px] small:text-[14px] md:text-s  lg:text-[18px] text-typography-link hover:underline  '>
														{child.name}{' '}
													</a>
													<span className='text-typography-lightGray text-xs font-normal'>
														({child.dm_childEntityIds?.length || 1})
													</span>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
							{document && (
								<React.Suspense fallback={<></>}>
									<div className='lg:block md:block hidden m-5'>
										<Map slug={name.toLowerCase()} />
									</div>
								</React.Suspense>
							)}
						</div>
						<div
							className=' my-[5rem]  p-8  

				md:p-[2.9rem]
				lg:p-[3rem]
				xl:p-[4rem]
				2xl:ml-[3rem] 
				large:mx-[9rem] large:p-[2.5rem]
				extraLarge:ml-[8.5rem] extraLarge:mr-[8erm] extraLarge:p-[2rem]
				'>
							<div className='lg:text-[32px] text-[22px] font-bold mb-3 text-typography-link leading-none mb-6'>
								About Branches in {name}
							</div>
							<div className='grid grid-cols-1 lg:grid-cols-2  '>
								<div className='text-typography-time font-normal opacity-[80%] lg:w-[480px] lg:pr-[0.5rem] mb-5'>
									<p className='text-xs'>
										Regional Finance has branch locations offering personal
										loans across {c_addressRegionDisplayName}. As a trusted
										lender providing personal loans across the nation for over
										30 years, our team knows how to lend a helping hand when you
										need a fast auto repair loan, appliance loan, travel loan,
										or debt consolidation loan in {c_addressRegionDisplayName}.
									</p>
								</div>

								<div
									className='text-typography-time font-normal 
						lg:w-[493px] lg:ml-[1rem]
						2xl:ml-0
						large:ml-[1.6rem]
						extraLarge:-ml-[2.8rem]
						'>
									<p className='mb-10 md:mb-4 text-xs opacity-[80%] '>
										You may have a few questions, and we're ready with answers.
										Call or drop by the branch location nearest you.
									</p>
									<p className='text-lg opacity-[80%]'>
										¿Hablas Español? Tenemos representantes de habla hispana que
										pueden ayudarlo. Llámenos para más información.
									</p>
								</div>
							</div>
						</div>
					</>
				)}
			</PageLayout>
		</>
	);
};

export default State;
