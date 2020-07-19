interface StringMap {
    [key: string]: string
}

const visibilities: StringMap = {
    public: "+",
    private: "-",
    protected: "#",
    package: "~",
};

/** Returns the appropriate icon for the given visibility. */
export default (visibility: string) => visibilities[visibility] || visibility;
