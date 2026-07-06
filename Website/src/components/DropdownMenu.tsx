import { motion, AnimatePresence } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface DropdownChild {
  title: string;
  description: string;
  href: string;
}

interface DropdownMenuProps {
  open: boolean;
  title: string;
  items: DropdownChild[];
}

export default function DropdownMenu({
  open,
  title,
  items,
}: DropdownMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
            y: 12,
            filter: "blur(6px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            y: 8,
            filter: "blur(4px)",
          }}
          transition={{
            duration: 0.22,
          }}
          className="
            absolute
            top-[calc(100%+18px)]
            left-1/2
            -translate-x-1/2
            w-[380px]
            rounded-[28px]
            border
            border-white/40
            bg-white/80
            backdrop-blur-2xl
            shadow-[0_25px_80px_rgba(15,23,42,0.12)]
            overflow-hidden
            z-[100]
          "
        >
          <div className="p-7">

            <div className="mb-6">

              <div className="text-[10px] uppercase tracking-[0.35em] font-bold text-brand-red">

                {title}

              </div>

            </div>

            <div className="space-y-1">

              {items.map((item) => (

                <Link
                  key={item.title}
                  to={item.href}
                  className="
                    group
                    flex
                    items-start
                    justify-between
                    rounded-2xl
                    p-4
                    transition-all
                    duration-300
                    hover:bg-slate-50
                  "
                >

                  <div>

                    <div className="font-semibold text-navy group-hover:text-brand-red transition-colors">

                      {item.title}

                    </div>

                    <div className="mt-1 text-sm leading-6 text-navy/55">

                      {item.description}

                    </div>

                  </div>

                  <ChevronRight
                    size={16}
                    className="
                      mt-1
                      text-navy/30
                      transition-all
                      duration-300
                      group-hover:translate-x-1
                      group-hover:text-brand-red
                    "
                  />

                </Link>

              ))}

            </div>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}