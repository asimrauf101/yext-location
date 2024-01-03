import * as React from 'react';
import { ReactNode } from 'react';
import { Link } from '@yext/pages/components';
import classNames from 'classnames';
import { AiOutlineRight } from 'react-icons/ai';

export interface BreadCrumbProps {
	name: string;
	slug?: string;
	breadcrumbs?: Array<BreadCrumbProps>;
	className?: string;
	separator?: ReactNode;
	baseUrl: string;
}

export interface BreadCrumbsProps {
	name?: any;
	breadcrumbs?: Array<BreadCrumbProps>;
	className?: string;
	separator?: ReactNode;
	baseUrl: string;
}

const Breadcrumb = (props: BreadCrumbProps) => {
	const { name, slug } = props;

	if (slug) {
		return (
			<Link href={slug}>
				<span className='font-bold hover:underline hover:cursor-pointer capitalize'>
					{name}
				</span>
			</Link>
		);
	}

	return (
		<span className=' text-xs font-nomal small:text-[12px] capitalize'>
			{name}
		</span>
	);
};

const BreadCrumbs = (props: BreadCrumbsProps) => {
	const {
		breadcrumbs,
		className,
		separator = (
			<AiOutlineRight className='w-[20px] h-[20px] small:w-[15px] small:w-[15px] ' />
		),
		baseUrl,
	} = props;
	const removeHyphen = (slug) => {
		let outputString = slug.replace(/-/g, ' ');
		return outputString;
	};

	return (
		<nav
			className=' mb-3 flex'
			aria-label='Breadcrumb'>
			{breadcrumbs?.length && (
				<nav
					className={classNames('Breadcrumbs  ', className)}
					aria-label='Breadcrumb'>
					<ol className='flex '>
						{breadcrumbs.map(({ name, slug }, idx) => {
							const isLast = idx === breadcrumbs.length - 1;
							const isFirst = idx === 0;

							return (
								<li
									className='Breadcrumbs-item flex items-center w-max text-s small:text-[12px] md:text-[13px] lg:text-xs text-typography-breadcrumb '
									key={idx}>
									{isFirst ? (
										<Breadcrumb
											name={'All Branches'}
											slug={isLast ? '' : baseUrl + slug}
											{...props}
										/>
									) : (
										<div className='pr-2 lg:pr-0 md:pr-0 font-normal  small:pr-0'>
											<Breadcrumb
												name={removeHyphen(name)}
												slug={isLast ? '' : baseUrl + slug}
												{...props}
											/>
										</div>
									)}
									{!isLast && (
										<span className=' lg:pl-2 pl-0'>{separator}</span>
									)}
								</li>
							);
						})}
					</ol>
				</nav>
			)}
		</nav>
	);
};

export default BreadCrumbs;
