import React from 'react';
import college_img1 from "../resources/images/3.jpg";
import { Link } from "react-router-dom";
import { ChevronRight } from 'lucide-react';

function PageHeader({ image, title, breadCrumbs }) {
  return (
    <div>
      <div className="h-[50vh] relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image || college_img1})` }}
          role="img"
          aria-label="Background image for the page header"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-5xl text-white mb-16">{title}</h1>
            <nav className="flex text-sm items-center mb-4 text-white" role="navigation">
              <Link to="/">Home</Link>
              {breadCrumbs.map(({ crumb, link }, index) => (
                <div className="flex items-center" key={index}>
                  <ChevronRight size={16} className="mx-2" />
                  <Link to={link}>
                    <span>{crumb}</span>
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;