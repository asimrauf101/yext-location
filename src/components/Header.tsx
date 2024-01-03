import * as React from 'react';
import Cta from './Cta';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Apis from '../utils/Apis';
import HeaderMenu from './Menu';
import MobileMenu from './MobileMenu';

const navigation = [
	{ name: 'Loans', href: '/' },
	{ name: 'Locations', href: '#' },
	{ name: 'Education', href: '#' },
	{ name: 'About us', href: '#' },
	{ name: 'Payment', href: '#' },
];

const Header = ({ navigation }) => {
	return (
		<Disclosure
			as='nav'
			className='bg-white shadow'>
			{({ open }) => (
				<>
					<div className='  px-[16px] '>
						<div className='flex lg:h-20 h-20 justify-between'>
							<div className='flex justify-between flex-1 xl:flex-none  '>
								<div className='flex flex-shrink-0 items-center '>
									<img
										className='block lg:hidden'
										src='https://regionalfinance.com/wp-content/uploads/2023/11/logo.svg'
										alt='Your Company'
										width='100'
										height='100'
									/>
									<img
										className='hidden lg:block'
										src='https://regionalfinance.com/wp-content/uploads/2023/11/logo.svg'
										alt='Your Company'
										style={{
											backgroundSize: 'cover', // or 'contain' depending on your preference
											backgroundPosition: 'center center', // adjust as needed
											width: '151px',
											height: '35px',
											imageRendering: 'inherit',
											position: 'relative', // if you need to adjust other elements on top
											zIndex: 1, // adjust as needed based on your layout
											margin: 0, // reset margin
											padding: 0, // reset padding
										}}
									/>
								</div>
								<div className='-ml-2 mr-2 flex  md:block xl:hidden '>
									{/* Mobile menu button */}
									<Disclosure.Button className='inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500  focus:ring-orange'>
										<span className='sr-only'>Open main menu</span>
										{open ? (
											<XMarkIcon
												className='block h-[50px] w-[50px] text-secondary font-semibold'
												aria-hidden='true'
											/>
										) : (
											<Bars3Icon
												className='block h-[55px] w-[55px] text-secondary font-bold'
												aria-hidden='true'
											/>
										)}
									</Disclosure.Button>
								</div>
								<div className='hidden lg:hidden xl:flex extraLarge:gap-x-[5rem] large:gap-x-[2rem] xl:gap-x-0 justify-between large:ml-[5rem]  md:ml-6 md:hidden lg:flex xl:ml-8 lg:ml-4 md:flex large:space-x-4'>
									{navigation.map((link) => (
										<HeaderMenu
											menuName={link.name}
											dropDown={link?.dropDown}
										/>
									))}
								</div>
							</div>
							<div className='flex items-center xl:gap-x-6 gap-2 lg:flex lg:hidden md:hidden xl:flex hidden'>
								<Cta
									buttonText='Prequalify Now'
									url='#'
									style='text-white font-normal text-[16px] px-[16px] py-[13px] xl:px-[16px] xl:py-[13px] xl:w-[200px] tracking-[0.5px]  text-center shadow-md bg-secondary rounded-md  hover:text-primary  '
								/>
								<Cta
									buttonText='Log In'
									url='#'
									style='text-white text-[16px] xl:px-[16px] xl:py-[13px] xl:w-[200px] px-[16px] py-[13px] tracking-[0.5px] 
									bg-primary text-center font-normal w-[100px] rounded-md hover:bg-secondary hover:text-primary '
								/>
							</div>
						</div>
					</div>

					<Disclosure.Panel className='lg:block xl:hidden'>
						<div className='px-[2rem] '>
							{navigation.map((link) => (
								<MobileMenu
									menuName={link.name}
									dropDown={link?.dropDown}
								/>
							))}
						</div>
						<div className='flex flex-col gap-y-[0.5rem] mt-8 mx-[8px]    '>
							<Cta
								buttonText='Prequalify Now'
								url='#'
								style='  text-white px-[16px] py-[13px] lg:py[32px] lg:w-[20%] w-[80%] tracking-[0.5px]  text-center shadow-md bg-secondary rounded-md  hover:text-primary  '
							/>
							<Cta
								buttonText='Log In'
								url='#'
								style='  text-white w-[80%] px-[16px] py-[13px] lg:py[32px] tracking-[0.5px] 
									bg-primary text-center lg:w-[20%] rounded-md hover:bg-secondary hover:text-primary '
							/>
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
};

export default Header;
