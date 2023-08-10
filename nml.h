#include <iostream>
#include <string>
#include <vector>
#include <fstream>

using namespace std;


const string nml_eol = "\n";

struct nml_file {
    nml_title_text title_;
    nml_content content_;
};
struct nml_group {
    nml_heading heading_;
    nml_content content_;
};
struct nml_heading {
    nml_title_text title_text_;
    nml_heading_level heading_level_;
};
typedef vector<nml_content_elm> nml_content;
struct nml_content_elm {
    string type_;

    nml_string string_;
    nml_string eol_ = nml_eol;
};
struct nml_title_text_elm {
    string type_;
    nml_text text_;
    nml_inline inline_;
};
typedef vector<nml_title_text_elm> nml_title_text;
typedef string nml_text; // 改行禁止
typedef string nml_string; // 改行ok
typedef string nml_inline;
typedef unsigned char nml_heading_level;


void NML_loader(string path);
void NML_parser(vector<string> fl);


void NML_loader(string path) {
    ifstream file(path,ios::in);
    vector<string> filelines;
    string tmp;
    while (getline(file,tmp)) {
        filelines.push_back(tmp);
    }
    // for (int i=0;i<filelines.size();i++) {
    //     cout << filelines[i] << endl;
    // }
    NML_parser(filelines);
}

void NML_parser(vector<string> fl) {
    return;
}