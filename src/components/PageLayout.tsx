import * as React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Banner } from './Location/Banner';
import SearchExperience from './SearchExperience';
import Search from './SearchBar';
import Loader from './Loader';
import Cta from './Cta';
import Apis from '../utils/Apis';

export interface PageLayoutProps {
	children?: React.ReactNode;
	_site?: any;
	content?: string;
	header?: any;
	footer?: any;
	mobileFooter?: any;
}

const PageLayout = ({
	children,
	_site,
	content,
	header,
	footer,
	mobileFooter,
}: PageLayoutProps) => {
	const [loading, Isloading] = React.useState(true);
	const [headerNav, setHeaderNav] = React.useState([]);
	const [footerNav, setFooterNav] = React.useState([]);
	const [mobileFooterNav, setMobileFooterNav] = React.useState([]);

	const fetchData = async () => {
		try {
			const [footer, header, mobileFooter] = await Promise.all([
				Apis.getDesktopFooter(),
				Apis.getHeaderMenuNav(),
				Apis.getMobileFooter(),
			]);
			setHeaderNav([
				{ name: header[0]?.title, href: '/', dropDown: header?.slice(1, 10) },
				{ name: header[10]?.title, href: '#', dropDown: [] },
				{ name: header[11]?.title, href: '#', dropDown: header?.slice(12, 15) },
				{
					name: header[20]?.title,
					href: '#',
					dropDown: header?.slice(21, 28),
				},
				{ name: header[28]?.title, href: '#', dropDown: [] },
				{ name: header[29]?.title, href: '#', dropDown: [] },
			]);
			setFooterNav(footer);
			setMobileFooterNav(mobileFooter);

			setTimeout(() => {
				Isloading(false);
			}, 1000);
		} catch (error) {
			console.log(error);
		}
	};

	React.useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<div className='min-h-screen'>
					<div className='sticky top-0 z-50'>
						<SearchExperience>
							<div className='lg:flex xl:hidden  md:flex  h-max flex gap-[0.5rem] items-center bg-[#e3eaf3] justify-between px-2  pt-4  '>
								<div>
									<Search />
								</div>
								<div className='mb-4 lg:mb-0 text-white'>
									<Cta
										buttonText='Log In'
										url='#'
										style=' btn lg:w-[200px] lg:py-[13px] text-xs font-semibold bg-orange shadow-md md:p-[0.8rem]  rounded-[5px]  bg-primary px-[0.8rem] text-s py-[0.9rem] text-center'
									/>
								</div>
							</div>
							{content && (
								<Banner
									variant='default'
									content={content}
								/>
							)}
							<div className='lg:hidden hidden xl:block'>
								<div className='grid grid-cols-12 bg-[#e3eaf3]'>
									<div className='col-span-8 extraLarge:col-span-9 large:col-span-8' />
									<div className='col-span-4 extraLarge:col-span-3 large:col-span-4 search'>
										<Search />
									</div>
								</div>
							</div>
							<Header
								_site={_site}
								navigation={headerNav}
							/>
						</SearchExperience>
					</div>

					{children}
					<Footer
						_site={_site}
						footerItems={footerNav}
						mobileFooterItems={mobileFooterNav}
					/>
				</div>
			)}
		</>
	);
};

export default PageLayout;
